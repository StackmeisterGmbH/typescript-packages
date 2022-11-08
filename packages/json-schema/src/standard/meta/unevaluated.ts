import type { Schema } from './schema'

/**
 * @category JSON-Schema Property
 */
export type UnevaluatedProperties<Value = unknown> = {
  readonly unevaluatedItems?: Schema<Value>
  readonly unevaluatedProperties?: Schema<Value>
}

/**
 * @category JSON-Schema Utility
 */
export const unevaluatedProperties: ReadonlyArray<keyof UnevaluatedProperties> = [
  'unevaluatedItems',
  'unevaluatedProperties',
] as const
