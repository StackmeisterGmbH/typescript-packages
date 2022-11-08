/**
 * Returns true if a value is undefined.
 *
 * @param value The value to check.
 * @returns True if the value is undefined, false otherwise.
 */
export const isUndefined = (value: unknown): value is undefined => value === undefined

/**
 * Returns true if a value is null.
 *
 * @param value The value to check.
 * @returns True if the value is null, false otherwise.
 */
export const isNull = (value: unknown): value is null => value === null

/**
 * Returns true if a value is null or undefined.
 *
 * @param value The value to check.
 * @returns True if the value is null or undefined, false otherwise.
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value === null || value === undefined

/**
 * Returns true if a value is a boolean.
 *
 * Equivalent with a `typeof value === 'boolean'` check.
 *
 * @param value The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

/**
 * Returns true if a value is a string.
 *
 * Equivalent with a `typeof value === 'string'` check.
 *
 * @param value The value to check.
 * @returns True if the value is a string, false otherwise.
 */
export const isString = (value: unknown): value is string => typeof value === 'string'

/**
 * Returns true if a value is a number.
 *
 * Equivalent with a `typeof value === 'number'` check.
 *
 * @param value The value to check.
 * @returns True if the value is a number, false otherwise.
 */
export const isNumber = (value: unknown): value is number => typeof value === 'number'

/**
 * Returns true if a value is an integer.
 *
 * Equivalent with a `typeof value === 'number'` check combined
 * with checking that it doesn't have any floating point digits.
 *
 * @param value The value to check.
 * @returns True if the value is a integer, false otherwise.
 */
export const isInteger = (value: unknown): value is number =>
  typeof value === 'number' && Math.floor(value) === value

/**
 * Returns true if a value is number-like.
 *
 * Number-like are any values that can cleanly be converted to numbers. This
 * can e.g. include booleans and strings that have a number-like format.
 *
 * @param value The value to check.
 * @returns True if the value is number-like, false otherwise.
 */
export const isNumeric = (value: unknown): value is string | number =>
  !isNaN(parseFloat(String(value))) && isFinite(Number(value))

/**
 * Returns true if a value is an array.
 *
 * Equivalent with a `Array.isArray` check.
 *
 * @param value The value to check.
 * @returns True if the value is an array, false otherwise.
 */
export const isArray = (value: unknown): value is Array<unknown> => Array.isArray(value)

/**
 * Returns true if a value is an object.
 *
 * Equivalent with a `typeof value === 'object' && value !== null && !Array.isArray(value)` check.
 *
 * Notice that arrays are explicitly excluded as they are seen as separate data structures
 * in the Stackmeister mindset of typing. There exists no other notion of `isObject` in order to
 * avoid confusion across libraries.
 *
 * There is also no notion of "checking for class identity", "checking if it's a flat object"
 * since in the Stackmeister JavaScript mindset objects are without identity
 * and are defined through shape alone, which greatly improves serialization capabilities.
 *
 * @param value The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Returns true if a value is a function.
 *
 * As functions are special, non-serializable object-values in the JavaScript world,
 * this function exists to filter out non-function values.
 *
 * @param value The value to check.
 * @returns True if the value is a function, false otherwise.
 */
export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === 'function'
