/**
 * Takes a bunch of values and creates a class name out of it.
 *
 * It will flatten all arrays. Any falsy values will be stripped.
 * Truthy values will be casted to a string.
 *
 * Allows defining classes in a really expression-ful way:
 *
 * ```jsx
 * <span classNames={classNames('mySpan', active && 'active', ['a', disabled ? 'disabled' : 'not-disabled'])}>
 * ```
 *
 * @param values
 * @returns
 */
const classNames = (...values: unknown[]): string => values.flat().filter(Boolean).join(' ')

export default classNames
