export const splitWhere = <T>(
  array: readonly T[],
  predicate: (value: T) => boolean,
): [start: readonly T[], end: readonly T[]] => {
  const cutoff = array.findIndex(value => predicate(value)) ?? array.length
  return [array.slice(0, cutoff), array.slice(cutoff)]
}

const consumeImplementation = <T, Result>(
  suffix: readonly T[],
  accumulator: Result,
  prefix: readonly T[],
  pivot: T | undefined,
  reducer: (value: T, state: Result) => Result | undefined,
): readonly [result: Result, suffix: readonly T[], pivot: T | undefined, prefix: readonly T[]] => {
  if (suffix.length === 0) {
    return [accumulator, suffix, pivot, prefix]
  }
  const [next, ...rest] = suffix
  const result = reducer(next, accumulator)
  return result === undefined
    ? [accumulator, rest, next, prefix]
    : consumeImplementation(rest, result, [...prefix, next], undefined, reducer)
}
/*
 * Reduce `array` using `initialValue` and `reducer`. The first value for which `reducer` returns
 * `undefined` is called the "pivot". Once a pivot is found stop reducing and immediately return
 * - the accumulated value
 * - the suffix from that point on, excluding the pivot
 * - the pivot, or `undefined` there is none
 * - the prefix that was reduced, excluding the pivot
 * */
export const consume = <T, Result>(
  array: readonly T[],
  initialValue: Result,
  reducer: (value: T, state: Result) => Result | undefined,
) => consumeImplementation(array, initialValue, [], undefined, reducer)

export type Constrained<Constraint> = <Concrete extends Constraint>(value: Concrete) => Concrete
export const constrained =
  <Constraint>(): Constrained<Constraint> =>
  value =>
    value
