import { isObject, isArray, isNumeric, toInteger } from '@stackmeister/types'

/**
 * Represents a JSON-pointer.
 *
 * This is mostly a visual type hint, JSON-pointers are always strings.
 *
 * It can be used to reference and change values in objects and arrays deeply.
 */
export type JsonPointer = string

/**
 * An error that is thrown whenever JSON-pointer resolving fails.
 */
export class JsonPointerError extends Error {
  readonly pointer: JsonPointer
  readonly target: unknown

  constructor(message: string, pointer: JsonPointer, target: unknown) {
    super(`Invalid JSON-Pointer ${pointer}: ${message}`)
    this.pointer = pointer
    this.target = target
  }
}

/**
 * Options that can be passed to the JSON-pointer get function.
 */
export type JsonPointerGetOptions<ResolvedValue> = {
  readonly default?: ResolvedValue
}

/**
 * Gets a value deeply by using a JSON-pointer.
 *
 * Unless you passed a default value via options,
 * this method will throw errors if the path can't
 * be followed properly.
 *
 * @param pointer the path to the value to retrieve.
 * @param target the value to retrieve from.
 * @param options configures the way values are retrieved.
 * @returns the found value.
 *
 * @throws {JsonPointerError}
 */
export const get = <ResolvedValue>(
  pointer: JsonPointer,
  target: unknown,
  options?: JsonPointerGetOptions<ResolvedValue>,
): ResolvedValue => {
  if (pointer === '') {
    return target as ResolvedValue
  }

  const [key, subPath] = splitPointer(pointer)

  if (isNumeric(key) && isArray(target)) {
    const index = toInteger(key)
    if (index >= target.length) {
      if (options && 'default' in options) {
        return options.default as ResolvedValue
      }
      throw new JsonPointerError(
        `Tried to access item at index ${index} but array length is only ${target.length}.`,
        pointer,
        target,
      )
    }
    const itemValue = target[index] as ResolvedValue
    return get(subPath, itemValue, options)
  }

  if (key && isObject(target)) {
    if (!(key in target)) {
      if (options && 'default' in options) {
        return options.default as ResolvedValue
      }
      throw new JsonPointerError(
        `Tried to access property key ${key} but it doesn't exist.`,
        pointer,
        target,
      )
    }
    const keyValue = target[key] as ResolvedValue
    return get(subPath, keyValue, options)
  }

  throw new JsonPointerError(
    `Can't access key or index ${key} on value of type ${typeof target}, it's neither an array nor an object.`,
    pointer,
    target,
  )
}

/**
 * Options that can be passed to the JSON-pointer set function.
 */
export type JsonPointerSetOptions = {
  readonly deep?: boolean
}

/**
 * Sets a value deeply and immutably by using a JSON-pointer.
 *
 * This method won't modify the passed target but instead
 * clone it recursively where needed.
 *
 * Unless you passed deep as true via options,
 * this method will throw errors if the path can't
 * be followed properly.
 *
 * With deep set to true it will create empty objects
 * whenever it can't access a key or index.
 *
 * @param pointer the path to set the value at.
 * @param target the target to set the value on.
 * @param value the value to set at the given path.
 * @param options configures the way values are set.
 * @returns the modified, final value.
 *
 * @throws {JsonPointerError}
 */
export const set = <ResolvedValue>(
  pointer: JsonPointer,
  target: unknown,
  value: unknown,
  options?: JsonPointerSetOptions,
): ResolvedValue => {
  if (pointer === '') {
    return value as ResolvedValue
  }

  const [key, subPath] = splitPointer(pointer)

  const numericKey = isNumeric(key)

  if ((numericKey || key === '-') && isArray(target)) {
    if (key === '-') {
      if (subPath) {
        if (options?.deep) {
          return [...target, set(subPath, {}, value, options)] as unknown as ResolvedValue
        }
        throw new JsonPointerError(
          `Trying to add to array deeply doesn't work, as we don't know how to construct the value properly. If you use '-' in your pointer, make sure the path to it exists.`,
          pointer,
          target,
        )
      }

      return [...target, value] as unknown as ResolvedValue
    }

    const index = toInteger(key)
    if (index >= target.length) {
      if (options?.deep) {
        return target.reduce((result, item, itemIndex) => {
          return itemIndex === index
            ? [...(result as unknown[]), set(subPath, {}, value, options), item]
            : [...(result as unknown[]), item]
        }, [] as unknown[]) as ResolvedValue
      }

      throw new JsonPointerError(
        `Tried to access item at index ${index} but array length is only ${target.length}.`,
        pointer,
        target,
      )
    }
    return target.map((item, itemIndex) =>
      itemIndex === index ? set(subPath, item, value, options) : item,
    ) as unknown as ResolvedValue
  }

  if (key && isObject(target)) {
    if (!(key in target)) {
      if (options?.deep) {
        return {
          ...target,
          [key]: set(subPath, {}, value, options),
        } as unknown as ResolvedValue
      }

      if (subPath) {
        throw new JsonPointerError(
          `Tried to set sub-path on property key ${key} but it doesn't exist.`,
          pointer,
          target,
        )
      }

      return {
        ...target,
        [key]: value,
      } as unknown as ResolvedValue
    }

    const itemValue = target[key]
    return {
      ...target,
      [key]: set(subPath, itemValue, value, options),
    } as unknown as ResolvedValue
  }

  throw new JsonPointerError(
    `Can't access key or index ${key} on value of type ${typeof value}, it's neither an array nor an object.`,
    pointer,
    target,
  )
}

/**
 * Options that can be passed to the JSON-pointer set function.
 */
export type JsonPointerRemoveOptions = {
  readonly deep?: boolean
}

/**
 * Removes a value deeply and immutably by using a JSON-pointer.
 *
 * This method won't modify the passed target but instead
 * clone it recursively where needed.
 *
 * Unless you passed deep as true via options,
 * this method will throw errors if the path can't
 * be followed properly.
 *
 * With deep set to true it will ignore paths it can't
 * follow as it would count as "deleted" from a data perspective.
 *
 * @param pointer the path to to remove.
 * @param target the target to remove the value on.
 * @param options configures the way values are removed.
 * @returns the modified, final value.
 *
 * @throws {JsonPointerError}
 */
export const remove = <ResolvedValue>(
  pointer: JsonPointer,
  target: unknown,
  options?: JsonPointerRemoveOptions,
): ResolvedValue => {
  if (pointer === '') {
    return undefined as unknown as ResolvedValue
  }

  const [key, subPath] = splitPointer(pointer)

  if (isNumeric(key) && isArray(target)) {
    const index = toInteger(key)
    if (index >= target.length) {
      if (options?.deep) {
        return target as unknown as ResolvedValue
      }

      throw new JsonPointerError(
        `Tried to remove item at index ${index} but array length is only ${target.length}.`,
        pointer,
        target,
      )
    }

    if (subPath !== '') {
      return target.map((item, itemIndex) =>
        itemIndex === index ? remove(subPath, item, options) : item,
      ) as unknown as ResolvedValue
    }

    return target.filter((_, itemIndex) => itemIndex !== index) as unknown as ResolvedValue
  }

  if (key && isObject(target)) {
    if (!(key in target)) {
      if (options?.deep) {
        return target as unknown as ResolvedValue
      }

      throw new JsonPointerError(
        `Tried to remove property key ${key} but it doesn't exist.`,
        pointer,
        target,
      )
    }

    if (subPath !== '') {
      const itemValue = target[key]
      return {
        ...target,
        [key]: remove(subPath, itemValue, options),
      } as unknown as ResolvedValue
    }

    return Object.fromEntries(
      Object.entries(target).filter(([childKey]) => childKey !== key),
    ) as unknown as ResolvedValue
  }

  throw new JsonPointerError(
    `Can't remove key or index ${key} on value of type ${typeof target}, it's neither an object, nor an array.`,
    pointer,
    target,
  )
}

/**
 * Encodes a property key in the JSON-schema standard way.
 *
 * @param key the key to encode.
 * @returns the encoded key.
 */
export const encodeKey = (key: string): string => key.replace(/~/g, '~0').replace(/\//g, '~1')

/**
 * Decodes a property key in the JSON-schema standard way.
 *
 * @param key the key to decode.
 * @returns the decoded key.
 */
export const decodeKey = (key: string): string => key.replace(/~1/g, '/').replace(/~0/g, '~')

/**
 * @param pointer
 *
 * @throws {JsonPointerError}
 */
const splitPointer = (pointer: JsonPointer): readonly [string, JsonPointer] => {
  if (!pointer.startsWith('/')) {
    throw new JsonPointerError(
      `Pointer needs to start with a forward slash (/) or be an empty string.`,
      pointer,
      undefined,
    )
  }

  const [key, ...subParts] = pointer.slice(1).split('/')
  const subPath = subParts.join('/')

  if (!key) {
    throw new JsonPointerError(
      `Pointer needs to have a property key after the forward slash.`,
      pointer,
      undefined,
    )
  }

  return [decodeKey(key), subPath === '' ? '' : `/${subPath}`]
}
