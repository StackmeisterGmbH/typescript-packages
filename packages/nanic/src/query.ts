import type { Registry, ResourceEntry } from './common.js'
import { compileAsync, compile } from 'expression-eval'
import { isObject } from '@stackmeister/types'

const cachedAsyncEvaluators: Record<
  string,
  (context: Record<string, unknown>) => Promise<unknown>
> = {}
const cachedEvaluators: Record<string, (context: Record<string, unknown>) => unknown> = {}
const queryUtils = {
  Structure: { value: { keys: (value: Record<string, unknown>) => Object.keys(value) } },
}

const createAsyncEvaluator = (expression: string) => (value: unknown) =>
  (
    cachedAsyncEvaluators[expression] ??
    (cachedAsyncEvaluators[expression] = compileAsync(expression))
  )(isObject(value) ? value : { value: value })

const createEvaluator = (expression: string) => (value: unknown) =>
  (cachedEvaluators[expression] ?? (cachedEvaluators[expression] = compile(expression)))(
    isObject(value) ? value : { value: value },
  )

type WrapDescriptors = Record<string, Pick<PropertyDescriptor, 'get' | 'value'>>
type Wrapped<Value, Descriptors extends WrapDescriptors> = Value & {
  [Key in keyof Descriptors]: Descriptors[Key] extends { value: infer FixedValue }
    ? FixedValue
    : Descriptors[Key] extends { get: infer Getter }
    ? Getter
    : unknown
}

const wrap = <Value, Descriptors extends WrapDescriptors>(
  value: Value,
  descriptors: Descriptors,
): Wrapped<Value, Descriptors> => {
  return Object.defineProperties(
    value,
    Object.fromEntries(
      Object.entries(descriptors).map(([key, descriptor]) => [
        key,
        'value' in descriptor
          ? { ...descriptor, enumerable: false, writable: false, configurable: false }
          : { ...descriptor, enumerable: false, configurable: false },
      ]),
    ),
  ) as Wrapped<Value, Descriptors>
}

const wrapEntry = ({ meta, document }: ResourceEntry) => {
  return wrap(document, {
    ...Object.fromEntries(Object.entries(meta).map(([key, value]) => [key, { value }])),
    ...queryUtils,
  })
}

const createList = <Value>(registry: Registry, items: Value[]) => {
  const wrapInnerList = <InnerValue>(innerItems: InnerValue[]) => createList(registry, innerItems)
  return wrap(items, {
    all: {
      get: () => items,
    },
    first: {
      get: () => items[0],
    },
    last: { get: () => items[items.length - 1] },
    atIndex: { value: (index: number) => items[index] },
    where: {
      value: (expression: string) => {
        const filterValue = createEvaluator(expression)
        return wrapInnerList(items.filter(item => filterValue(item)))
      },
    },
    select: {
      value: (expression: string) => {
        const selectValue = createEvaluator(expression)
        return wrapInnerList(items.map(item => selectValue(item)))
      },
    },
    groupBy: {
      value: (expression: string) => {
        const getKey = createEvaluator(expression)
        const grouped = items.reduce((result: Record<string, unknown[]>, item) => {
          const key = String(getKey(item))
          if (!result[key]) {
            result[key] = []
          }
          result[key].push(item)
          return result
        }, {} as Record<string, unknown[]>)
        return Object.fromEntries(
          Object.entries(grouped).map(([key, value]) => [key, wrapInnerList(value)]),
        )
      },
    },
    indexBy: {
      value: (expression: string) => {
        const getKey = createEvaluator(expression)
        return items.reduce((result: Record<string, unknown>, item) => {
          const key = String(getKey(item))
          result[key] = item
          return result
        }, {} as Record<string, unknown>)
      },
    },
  })
}

const wrapEntries = (registry: Registry, entries: ResourceEntry[]) => {
  const wrappedEntries = entries.map(wrapEntry)
  const collection = createList(registry, wrappedEntries)
  return wrap(collection, {
    ids: { get: () => collection.select('id') },
    names: { get: () => collection.select('name') },
  })
}

export const wrapRegistry = (registry: Registry) => {
  const resources = Object.fromEntries(
    Object.values(registry.resources).map(({ document }) => [
      document.collection as string,
      wrapEntries(registry, Object.values(registry[document.collection as string] ?? {})),
    ]),
  )
  return wrap(resources, {
    registry: { get: () => registry },
    ...queryUtils,
  })
}

export const createQueryHost = (registry: Registry) => {
  const query = async (expression: string): Promise<unknown> => {
    const evaluate = createAsyncEvaluator(expression)
    return await evaluate(wrapRegistry(registry))
  }
  return { query }
}
