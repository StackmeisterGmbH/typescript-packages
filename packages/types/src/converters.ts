/**
 * Converts a value to either the value or undefined.
 *
 * This is useful if you don't know if your value is `null` or `undefined`
 * and you definitely want it to be `undefined`.
 *
 * @param value The value to convert.
 * @returns The converted value.
 */
export const toUndefinable = <Value>(value: Value): Value | undefined => value ?? undefined

/**
 * Converts a value to either the value or null.
 *
 * This is useful if you don't know if your value is `null` or `undefined`
 * and you definitely want it to be `null`.
 *
 * @param value The value to convert.
 * @returns The converted value.
 */
export const toNullable = <Value>(value: Value): Value | null => value ?? null

/**
 * Converts a value to a boolean.
 *
 * This is equivalent with using the `Boolean` constructor.
 *
 * @param value The value to convert.
 * @returns The converted value.
 */
export const toBoolean = (value: unknown): boolean => Boolean(value)

/**
 * Converts a value to a string.
 *
 * This is equivalent with using the `String` constructor.
 *
 * @param value The value to convert.
 * @returns The converted value.
 */
export const toString = (value: unknown): string => String(value)

/**
 * Converts a value to a number.
 *
 * This is equivalent with using the `Number` constructor.
 *
 * @param value The value to convert.
 * @returns The converted value.
 */
export const toNumber = (value: unknown): number => Number(value)

/**
 * Converts a value to an integer.
 *
 * This is equivalent with rounding the result of `toNumber`.
 *
 * @param value The value to convert.
 * @returns The converted value.
 */
export const toInteger = (value: unknown): number => Math.round(toNumber(value))
