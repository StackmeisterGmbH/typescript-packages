import { isBoolean, isObject } from '@stackmeister/types'
import type { JsType } from './common'
import type {
  AnySchema,
  NoneSchema,
  DynamicAnchor,
  DynamicRef,
  RecursiveAnchor,
  RecursiveRef,
} from './schemas'
import type { Schema, SchemaObject } from './standard/meta/schema'
import type { SimpleType } from './standard/meta/validation'
import { getValueSimpleType } from './validators/validation'
import { isRef, isRefAnchor, isRefRoot } from '@stackmeister/json-ref'

export { isRef, isRefAnchor, isRefRoot }

const schemaKeys = <Keys extends (keyof SchemaObject)[]>(keys: Keys): Keys => keys

export const compositionProperties = schemaKeys([
  'if',
  'then',
  'else',
  'allOf',
  'anyOf',
  'oneOf',
  'not',
])

export type CompositionProperties = typeof compositionProperties[number]

export const numberProperties = schemaKeys([
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
])

export type NumberProperties = typeof numberProperties[number]

export const stringProperties = schemaKeys(['maxLength', 'minLength', 'pattern'])

export type StringProperties = typeof stringProperties[number]

export const arrayProperties = schemaKeys([
  'prefixItems',
  'items',
  'contains',
  'unevaluatedItems',
  'maxItems',
  'minItems',
  'uniqueItems',
  'maxContains',
  'minContains',
])

export type ArrayProperties = typeof arrayProperties[number]

export const objectProperties = schemaKeys([
  'additionalProperties',
  'properties',
  'patternProperties',
  'dependentSchemas',
  'propertyNames',
  'unevaluatedProperties',
  'maxProperties',
  'minProperties',
  'required',
  'dependentRequired',
])

export type ObjectProperties = typeof objectProperties[number]

export const simpleProperties = schemaKeys([
  'type',
  ...numberProperties,
  ...stringProperties,
  ...arrayProperties,
  ...objectProperties,
])

export type SimpleProperties = typeof simpleProperties[number]

const isSchemaType = (type: SimpleType, schema: SchemaObject): boolean =>
  schema.type === type ||
  (Array.isArray(schema.type) && schema.type.includes(type)) ||
  (schema.enum !== undefined && schema.enum.some(value => getValueSimpleType(value) === type)) ||
  (schema.default !== undefined && getValueSimpleType(schema.default) === type) ||
  (schema.const !== undefined && getValueSimpleType(schema.const) === type)

const schemaContainsOneOf = (keys: (keyof SchemaObject)[], schema: SchemaObject) =>
  Object.keys(schema).some(key => keys.includes(key as keyof SchemaObject))

export const isNullSchema = (schema: Schema): boolean =>
  isObject(schema) && isSchemaType('null', schema)

export const isBooleanSchema = (schema: Schema): boolean =>
  isObject(schema) && isSchemaType('boolean', schema)

export const isIntegerSchema = (schema: Schema): boolean =>
  isObject(schema) && isSchemaType('integer', schema)

export const isNumberSchema = (schema: Schema): boolean =>
  isObject(schema) &&
  (isSchemaType('number', schema) || schemaContainsOneOf(numberProperties, schema))

export const isStringSchema = (schema: Schema): boolean =>
  isObject(schema) &&
  (isSchemaType('string', schema) || schemaContainsOneOf(stringProperties, schema))

export const isObjectSchema = (schema: Schema): boolean =>
  isObject(schema) &&
  (isSchemaType('object', schema) || schemaContainsOneOf(objectProperties, schema))

export const isArraySchema = (schema: Schema): boolean =>
  isObject(schema) &&
  (isSchemaType('array', schema) || schemaContainsOneOf(arrayProperties, schema))

export const isSimpleSchema = (schema: Schema): boolean =>
  isNullSchema(schema) ||
  isBooleanSchema(schema) ||
  isIntegerSchema(schema) ||
  isNumberSchema(schema) ||
  isStringSchema(schema) ||
  isObjectSchema(schema) ||
  isArraySchema(schema)

export const isNullableSchema = (schema: Schema): boolean => {
  if (!isObject(schema)) {
    return false
  }

  if (schema.type?.includes('null')) {
    return true
  }

  return schema.oneOf?.some(isNullSchema) ?? false
}

export const isAnySchema = (schema: Schema): schema is AnySchema =>
  schema === true || (isObject(schema) && Object.keys(schema).length === 0)

export const isNoneSchema = (schema: Schema): schema is NoneSchema =>
  schema === false || (isObject(schema) && schema.not !== undefined && isAnySchema(schema.not))

export const isCompositionSchema = (schema: Schema): boolean =>
  isObject(schema) && schemaContainsOneOf(compositionProperties, schema)

/**
 * @category Predicate
 */
export const isSchema = (value: unknown): value is Schema => isBoolean(value) || isObject(value)

const propertyIsType = (value: unknown, propertyName: string, expectedType: JsType) =>
  isObject(value) && typeof value[propertyName] === expectedType

/**
 * @category Predicate
 */
export const isRecursiveRef = (value: unknown): value is RecursiveRef =>
  propertyIsType(value, '$recursiveRef', 'string')

/**
 * @category Predicate
 */
export const isRecursiveAnchor = (value: unknown): value is RecursiveAnchor =>
  propertyIsType(value, '$recursiveAnchor', 'boolean')

/**
 * @category Predicate
 */
export const isDynamicRef = (value: unknown): value is DynamicRef =>
  propertyIsType(value, '$dynamicRef', 'string')

/**
 * @category Predicate
 */
export const isDynamicAnchor = (value: unknown): value is DynamicAnchor =>
  propertyIsType(value, '$dynamicAnchor', 'string')
