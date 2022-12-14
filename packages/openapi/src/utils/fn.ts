export type Transformer<Value> = (value: Value) => Value

export const transform =
  <Value>(...transformers: Transformer<Value>[]): Transformer<Value> =>
  value =>
    transformers.reduce((value, transformer) => transformer(value), value)

export const always =
  <Value>(value: Value): Transformer<Value> =>
  () =>
    value
