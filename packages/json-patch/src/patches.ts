import type { JsonPointer } from '@stackmeister/json-pointer'
import equals from '@stackmeister/equals'
import {
  get as getPointer,
  remove as removePointer,
  set as setPointer,
} from '@stackmeister/json-pointer'
import { isArray, isNumeric, isObject, toInteger } from '@stackmeister/types'

/**
 * An operation to add a new property in an object or a new value to an array.
 */
export type JsonAddOperation<Value = unknown> = {
  readonly op: 'add'
  readonly path: JsonPointer
  readonly value: Value
}

/**
 * An action to remove a property in an object or an index in an array.
 *
 * In arrays, elements with higher indexes will move down one index
 */
export type JsonRemoveOperation = {
  readonly op: 'remove'
  readonly path: JsonPointer
}

/**
 * An action to replace a property in an object or an index in an array.
 *
 * In arrays, this operation will throw an error if the element doesn't exist.
 */
export type JsonReplaceOperation<Value = unknown> = {
  readonly op: 'replace'
  readonly path: JsonPointer
  readonly value: Value
}

/**
 * An action to value from one property or index to another.
 *
 * Equal to a remove() and add() operation on the path and value.
 */
export type JsonMoveOperation = {
  readonly op: 'move'
  readonly from: JsonPointer
  readonly path: JsonPointer
}

/**
 * An action to copy a value from one property or index to another.
 */
export type JsonCopyOperation = {
  readonly op: 'copy'
  readonly from: JsonPointer
  readonly path: JsonPointer
}

/**
 * An action to test if a value equals a given value.
 *
 * @see {JsonTestError}
 */
export type JsonTestOperation<Value = unknown> = {
  readonly op: 'test'
  readonly path: JsonPointer
  readonly value: Value
}

/**
 * An operation that can be performed in a JSON-Patch.
 */
export type JsonOperation =
  | JsonAddOperation
  | JsonRemoveOperation
  | JsonReplaceOperation
  | JsonMoveOperation
  | JsonCopyOperation
  | JsonTestOperation

/**
 * A JSON-Patch document.
 *
 * @see {JsonOperation}
 */
export type JsonPatch = JsonOperation[]

/**
 * An error that occurs during JSON-Patch application or value observation.
 */
export class JsonPatchError extends Error {}

/**
 * An error that occurs when a test-operation failed.
 *
 * @see {JsonTestOperation}
 */
export class JsonTestError extends JsonPatchError {}

/**
 * Creates an JSON add operation.
 *
 * @param path the path to add the value to.
 * @param value the value to add.
 * @returns the add operation.
 */
export const add = <Value = unknown>(path: JsonPointer, value: Value): JsonAddOperation<Value> => ({
  op: 'add',
  path,
  value,
})

/**
 * Creates a JSON remove operation.
 *
 * @param path the path to remove.
 * @returns the remove operation.
 */
export const remove = (path: JsonPointer): JsonRemoveOperation => ({ op: 'remove', path })

/**
 * Creates a JSON replace operation.
 *
 * @param path the path to replace the value of.
 * @param value the value to place.
 * @returns the replace operation.
 */
export const replace = <Value = unknown>(
  path: JsonPointer,
  value: Value,
): JsonReplaceOperation<Value> => ({
  op: 'replace',
  path,
  value,
})

/**
 * Creates a JSON move operation.
 *
 * @param from the path to move the value from.
 * @param path the path to move the value to.
 * @returns the move operation.
 */
export const move = (from: JsonPointer, path: JsonPointer): JsonMoveOperation => ({
  op: 'move',
  from,
  path,
})

/**
 * Creates a JSON copy operation.
 *
 * @param from the path to copy the value from.
 * @param path the path to copy the value to.
 * @returns the copy operation.
 */
export const copy = (from: JsonPointer, path: JsonPointer): JsonCopyOperation => ({
  op: 'copy',
  from,
  path,
})

/**
 * Creates a JSON test operation.
 *
 * @param path the path to test.
 * @param value the value the path's value needs to equal.
 * @returns the test operation.
 */
export const test = <Value = unknown>(
  path: JsonPointer,
  value: Value,
): JsonTestOperation<Value> => ({
  op: 'test',
  path,
  value,
})

/**
 * Applies a single JSON Patch operation to a value.
 *
 * Can be perfectly used with Array.prototype.reduce on an array of operations.
 *
 * @param value the value to apply the operation on.
 * @param operation the operation to apply.
 * @returns the patched value.
 */
export const applyOperation = <Value>(value: Value, operation: JsonOperation): Value => {
  switch (operation.op) {
    case 'add':
      return setPointer(operation.path, value, operation.value)
    case 'remove':
      return removePointer(operation.path, value)
    case 'replace':
      return setPointer(operation.path, value, operation.value)
    case 'move': {
      const targetValue = getPointer(operation.from, value)
      return setPointer(operation.path, removePointer(operation.from, value), targetValue)
    }
    case 'copy': {
      const targetValue = getPointer(operation.from, value)
      return setPointer(operation.path, value, targetValue)
    }
    case 'test': {
      const targetValue = getPointer(operation.path, value)
      if (!equals(targetValue, operation.value)) {
        throw new JsonTestError(`Value at path ${operation.path} is not equal to test value.`)
      }
      return value
    }
  }
}

/**
 * Applies a JsonPatch document to a value.
 *
 * @param value the value to apply the document on.
 * @param document the JSON Patch document to apply.
 * @returns the patched value.
 */
export const applyPatch = <Value>(value: Value, document: JsonPatch): Value => {
  return document.reduce(applyOperation, value)
}

const createObservedArray = <Value extends Array<unknown>>(
  value: Value,
  options: ObserveOptions,
): Value => {
  const draft = value.map((itemValue, index) =>
    createObserved(itemValue, { ...options, path: `${options.path}/${index}` }),
  )

  // Observe array keys
  return new Proxy(draft, {
    set: (target, key, newValue) => {
      if (typeof key === 'symbol' || !isNumeric(key)) {
        throw new JsonPatchError(
          `Untracked change of key ${key.toString()} on path ${options.path}.`,
        )
      }

      const index = toInteger(key)
      const childPath = `${options.path}/${index}`

      if (index >= value.length) {
        throw new JsonPatchError(
          `Array index at path ${childPath} is out of range. In JSON-Patch drafts you should only edit existing array keys and create new ones by using Array.prototype.push().`,
        )
      }

      options.onOperation(replace(childPath, newValue))
      return Reflect.set(target, index, newValue)
    },
    get: (target, key, receiver) => {
      switch (key) {
        case 'push': {
          return (...newValues: unknown[]) => {
            Reflect.get(target, key, receiver).apply(target, newValues)
            newValues.forEach(newValue => options.onOperation(add(`${options.path}/-`, newValue)))
          }
        }
        case 'splice':
        case 'copyWithin':
        case 'fill':
        case 'unshift':
        case 'reverse':
        case 'sort': {
          return (...args: unknown[]) => {
            Reflect.get(target, key, receiver).apply(target, args)
            options.onOperation(replace(options.path, target))
          }
        }
      }
      return Reflect.get(target, key, receiver)
    },
  }) as Value
}

const createObservedObject = <Value extends Record<string, unknown>>(
  value: Value,
  options: ObserveOptions,
): Value => {
  const draft = Object.fromEntries(
    Object.entries(value).map(([key, keyValue]) => [
      key,
      createObserved(keyValue, { ...options, path: `${options.path}/${key}` }),
    ]),
  )

  // Observe object keys
  return new Proxy(draft, {
    set: (target, key, newValue) => {
      if (typeof key === 'symbol') {
        throw new JsonPatchError(
          `Untracked change of key ${key.toString()} on path ${options.path}.`,
        )
      }

      const childPath = `${options.path}/${key}`
      if (getPointer(childPath, options.root, { default: undefined }) === undefined) {
        options.onOperation(add(`${options.path}/${key}`, newValue))
      } else {
        options.onOperation(replace(`${options.path}/${key}`, newValue))
      }
      return Reflect.set(target, key, newValue)
    },
    defineProperty: (target, key, descriptor) => {
      if (typeof key === 'symbol') {
        throw new JsonPatchError(
          `Untracked addition of key ${key.toString()} on path ${options.path}.`,
        )
      }

      options.onOperation(add(`${options.path}/${key}`, descriptor.value ?? descriptor.get?.()))
      return Reflect.defineProperty(target, key, descriptor)
    },
    deleteProperty: (target, key) => {
      if (typeof key === 'symbol') {
        throw new JsonPatchError(
          `Untracked deletion of key ${key.toString()} on path ${options.path}.`,
        )
      }

      options.onOperation(remove(`${options.path}/${key}`))
      return Reflect.deleteProperty(target, key)
    },
  }) as Value
}

type ObserveOptions = {
  readonly path: JsonPointer
  readonly root: Record<string, unknown> | Array<unknown>
  readonly onOperation: (operation: JsonOperation) => void
}

const createObserved = <Value>(value: Value, options: ObserveOptions): Value => {
  if (isArray(value)) {
    return createObservedArray(value, options)
  }

  if (isObject(value)) {
    return createObservedObject(value, options)
  }

  return value
}

/**
 * Creates an observed draft of a value.
 *
 * Modifying the draft will result in onOperation being triggered with respective
 * JSON Patch operations for the mutations done.
 *
 * @param value the value to observe.
 * @param onOperation the handler when a JSON Operation is triggered by mutation.
 * @returns the draft value.
 */
export const createDraft = <Value extends Record<string, unknown> | Array<unknown>>(
  value: Value,
  onOperation: (operation: JsonOperation) => void,
): Value => {
  return createObserved(value, { path: '', root: value, onOperation })
}

/**
 * Creates a patch from a set of mutations on a value.
 *
 * The passed function receives a draft of the value and can
 * mutate it as needed. For every mutation done on the draft,
 * a JSON Patch operation will be created.
 *
 * After all mutations are done, you will receive a full JSON Patch document
 * for the respective mutations done.
 *
 * @param value the value to create a patch for.
 * @param mutate a function that mutates the value.
 * @returns the patch for the mutations done on the value.
 */
export const createPatch = <Value extends Record<string, unknown> | Array<unknown>>(
  value: Value,
  mutate: (value: Value) => void,
): JsonPatch => {
  const collectedOperations: JsonOperation[] = []
  const draft = createDraft(value, operation => collectedOperations.push(operation))
  mutate(draft)
  return collectedOperations
}

/**
 * Applies a set of mutations on a value and returns a new value with these mutations applied.
 *
 * This can be used to immutably modify values with a mutable API.
 *
 * @param value the value to mutate.
 * @param mutate a function that mutates the value.
 * @returns a new value with the done mutations applied.
 */
export const applyMutation = <Value extends Record<string, unknown> | Array<unknown>>(
  value: Value,
  mutate: (value: Value) => void,
): Value => {
  const patch = createPatch(value, mutate)
  return applyPatch(value, patch)
}
