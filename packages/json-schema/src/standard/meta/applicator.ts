import type { RegexString } from './common'
import type { Schema } from './schema'

/**
 * @category JSON-Schema Utility
 */
export type Items<Value = unknown> = Value extends Array<infer Item> ? Schema<Item> : Schema

/**
 * @category JSON-Schema Utility
 */
export type Properties<Value = unknown> = Value extends Record<string, unknown>
  ? { [Key in keyof Value]: Schema<Value[Key]> }
  : Record<string, Schema>

/**
 * @category JSON-Schema Property
 */
export type ApplicatorProperties<Value = unknown> = {
  readonly prefixItems?: ReadonlyArray<Schema<Value>>
  readonly items?: Items<Value>
  readonly contains?: Schema
  readonly additionalProperties?: Schema
  readonly properties?: Properties<Value>
  readonly patternProperties?: Record<RegexString, Schema>
  readonly dependentSchemas?: Properties<Value>
  readonly propertyNames?: Schema<string>
  readonly if?: Schema<Value>
  readonly then?: Schema<Value>
  readonly else?: Schema<Value>
  readonly allOf?: ReadonlyArray<Schema<Value>>
  readonly anyOf?: ReadonlyArray<Schema<Value>>
  readonly oneOf?: ReadonlyArray<Schema<Value>>
  readonly not?: Schema<Value>
}

/**
 * @category JSON-Schema Utility
 */
export const applicatorProperties: ReadonlyArray<keyof ApplicatorProperties> = [
  'prefixItems',
  'items',
  'contains',
  'additionalProperties',
  'properties',
  'patternProperties',
  'dependentSchemas',
  'propertyNames',
  'if',
  'then',
  'else',
  'allOf',
  'anyOf',
  'oneOf',
  'not',
] as const
