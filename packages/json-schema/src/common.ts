import type { SimpleType } from './standard/meta/validation'
import type { Schema } from './standard/meta/schema'
import { isArray, isBoolean, isObject } from '@stackmeister/types'
import { isSchema } from './predicates'

/**
 * @category Utility
 */
export const schemaStandards = {
  draft202012: 'https://json-schema.org/draft/2020-12/schema#',
  hyper: 'http://json-schema.org/hyper-schema#',
  draft04: 'http://json-schema.org/draft-04/schema#',
  draft04Hyper: 'http://json-schema.org/draft-04/hyper-schema#',
  draft03: 'http://json-schema.org/draft-03/schema#',
  draft03Hyper: 'http://json-schema.org/draft-03/hyper-schema#',
} as const

/**
 * @category Utility
 */
export type SchemaStandard = typeof schemaStandards[keyof typeof schemaStandards]

/**
 * @category Utility
 */
export type LatestSchemaStandard = typeof schemaStandards.draft202012

/**
 * @category Utility
 */
export const jsTypes = [
  'string',
  'number',
  'bigint',
  'boolean',
  'symbol',
  'undefined',
  'object',
  'function',
] as const

/**
 * @category Utility
 */
export type JsType = typeof jsTypes[number]

/**
 * @category Utility
 * @internal
 */
export const jsTypeMap: Record<JsType, SimpleType> = {
  string: 'string',
  number: 'number',
  bigint: 'string',
  boolean: 'boolean',
  symbol: 'string',
  undefined: 'null',
  object: 'object',
  function: 'object',
}

/**
 * @category Utility
 */
export const defaults: Record<SimpleType, unknown> = {
  string: '',
  number: 0,
  boolean: false,
  integer: 0,
  null: null,
  array: [],
  object: {},
}

/**
 * Takes a schema and returns the names of all properties of the passed value that are evaluated by it.
 *
 * @category Utility
 *
 * @param schema The schema to evaluate.
 * @param value The value to evaluate against.
 * @returns The evaluated property keys in value.
 */
export const getEvaluatedProperties = (schema: Schema, value: unknown): string[] => {
  if (isBoolean(schema) || !isObject(value)) {
    return []
  }

  return Object.keys(value).filter(
    key =>
      (isObject(schema.properties) && key in schema.properties) ||
      (isObject(schema.patternProperties) &&
        Object.keys(schema.patternProperties).some(pattern => key.match(new RegExp(pattern)))),
  )
}

/**
 * Takes a schema and a value and returns the amount of items it evaluates.
 *
 * @category Utility
 *
 * @param schema The schema to evaluate.
 * @param value The value to evaluate against.
 * @returns The amount of evaluated items.
 */
export const getEvaluatedLength = (schema: Schema, value: unknown): number => {
  if (isBoolean(schema) || !isArray(value)) {
    return 0
  }

  return isSchema(schema.items) ? Infinity : schema.prefixItems?.length ?? 0
}
