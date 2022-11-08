import type { RegexString } from './common'

/**
 * An array of all normal, primitive types JSON-Schema supports.
 *
 * @category JSON-Schema Utility
 */
export const simpleTypes = [
  'array',
  'boolean',
  'integer',
  'null',
  'number',
  'object',
  'string',
] as const

/**
 * A literal string type representing all of the primitive types JSON-Schema supports.
 *
 * @category JSON-Schema Utility
 */
export type SimpleType = typeof simpleTypes[number]

/**
 * A type that lets `keyof` fall back to a normal string if the provided value is unknown.
 *
 * @category JSON-Schema Utility
 * @internal
 */
export type RequiredKeys<Value = unknown> = Value extends Record<string, unknown>
  ? keyof Value
  : string

/**
 * Represents an array of required property keys for a object JSON-Schema.
 *
 * @category JSON-Schema Utility
 */
export type Requirements<Value = unknown> = ReadonlyArray<RequiredKeys<Value>>

/**
 * Represents a structure for schema dependencies on properties for a object JSON-Schema.
 *
 * @category JSON-Schema Utility
 */
export type DependentRequirements<Value = unknown> = Record<
  RequiredKeys<Value>,
  ReadonlyArray<RequiredKeys<Value>>
>

/**
 * @category JSON-Schema Property
 */
export type ValidationProperties<Value = unknown> = {
  readonly type?: SimpleType | ReadonlyArray<SimpleType>
  readonly const?: Value
  readonly enum?: ReadonlyArray<Value>
  readonly multipleOf?: number
  readonly maximum?: number
  readonly exclusiveMaximum?: number
  readonly minimum?: number
  readonly exclusiveMinimum?: number
  readonly maxLength?: number
  readonly minLength?: number
  readonly pattern?: RegexString
  readonly maxItems?: number
  readonly minItems?: number
  readonly uniqueItems?: boolean
  readonly maxContains?: number
  readonly minContains?: number
  readonly maxProperties?: number
  readonly minProperties?: number
  readonly required?: Requirements<Value>
  readonly dependentRequired?: DependentRequirements<Value>
}

/**
 * @category JSON-Schema Utility
 */
export const validationProperties = [
  'type',
  'const',
  'enum',
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'maxItems',
  'minItems',
  'uniqueItems',
  'maxContains',
  'minContains',
  'maxProperties',
  'minProperties',
  'required',
  'dependentRequired',
] as const
