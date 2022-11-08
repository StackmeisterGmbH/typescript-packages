import { isArray, isObject } from '@stackmeister/types'

/**
 * Options to control how a value is cloned.
 */
export type CloneOptions = {
  /**
   * A map of references in our current cloning process.
   */
  readonly referenceMap?: WeakMap<object, unknown>
}

/**
 * Creates a deep clone of any value.
 *
 * Class identity is ignored. All objects will end up in instances of Object.
 *
 * This cloning method can handle recursion properly and will create a recursive clone.
 *
 * @param value the value to clone.
 * @returns the cloned value.
 */
const clone = <Value>(value: Value, options?: CloneOptions): Value => {
  const referenceMap = options?.referenceMap ?? new WeakMap()
  const childOptions = { ...options, referenceMap }

  const array = isArray(value)
  const object = isObject(value)

  if (array || object) {
    if (referenceMap.has(value)) {
      return referenceMap.get(value) as Value
    }

    if (array) {
      const arrayRef: unknown[] = []
      referenceMap.set(value, arrayRef)
      value.forEach(item => arrayRef.push(clone(item, childOptions)))
      return arrayRef as unknown as Value
    }
    const objectRef: Record<string, unknown> = {}
    referenceMap.set(value, objectRef)
    Object.entries(value).forEach(
      ([key, keyValue]) => (objectRef[key] = clone(keyValue, childOptions)),
    )
    return objectRef as unknown as Value
  }

  return value
}

export default clone
