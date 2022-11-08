import { isBoolean, isObject } from '@stackmeister/types'
import { defaults } from './common'
import type {
  ArrayProperties,
  NumberProperties,
  ObjectProperties,
  StringProperties,
} from './predicates'
import {
  isArraySchema,
  isBooleanSchema,
  isIntegerSchema,
  isNumberSchema,
  isObjectSchema,
  isStringSchema,
} from './predicates'
import type {
  ArrayTypeSchema,
  BooleanTypeSchema,
  IntegerTypeSchema,
  NullTypeSchema,
  NumberTypeSchema,
  ObjectTypeSchema,
  StringTypeSchema,
} from './schemas'
import type { Schema, SchemaObject } from './standard/meta/schema'

type SplitProps<Value> = {
  [Key in keyof Value]: Record<Key, Value[Key]>
}[keyof Value]

type UnionToIntersection<Union> = (
  Union extends unknown ? (distributedUnion: Union) => void : never
) extends (mergedIntersection: infer Intersection) => void
  ? Intersection
  : never

export type NumberSchema =
  | IntegerTypeSchema
  | NumberTypeSchema
  | SplitProps<Pick<SchemaObject, NumberProperties>>

export type StringSchema = StringTypeSchema | SplitProps<Pick<SchemaObject, StringProperties>>

export type ObjectSchema = ObjectTypeSchema | SplitProps<Pick<SchemaObject, ObjectProperties>>

export type ObjectSchemaProperties<SchemaType extends ObjectSchema> = SchemaType extends {
  properties: infer Properties
}
  ? { [Key in keyof Properties]: SchemaValue<Properties[Key]> }
  : SchemaType extends { additionalProperties: infer AdditionalProperty }
  ? Record<string, SchemaValue<AdditionalProperty>>
  : SchemaType extends { patternProperties: infer PatternProperty }
  ? Record<string, SchemaValue<PatternProperty>>
  : Record<string, unknown>

export type ArraySchemaItems<SchemaType extends ArraySchema> = SchemaType extends {
  items: infer Item
}
  ? SchemaValue<Item>[]
  : unknown[]

export type ArraySchema = ArrayTypeSchema | SplitProps<Pick<SchemaObject, ArrayProperties>>

export type SchemaValue<SchemaType extends Schema> = SchemaType extends true
  ? unknown
  : SchemaType extends false
  ? undefined
  : SchemaType extends
      | {
          const: infer ConstValue
        }
      | { default: infer ConstValue }
  ? ConstValue
  : SchemaType extends { enum: ReadonlyArray<infer EnumValue> }
  ? EnumValue
  : SchemaType extends
      | { oneOf: ReadonlyArray<infer Schemas> }
      | { anyOf: ReadonlyArray<infer Schemas> }
  ? SchemaValue<Schemas>
  : SchemaType extends { allOf: ReadonlyArray<infer Schemas> }
  ? UnionToIntersection<SchemaValue<Schemas>>
  : SchemaType extends { then: infer ThenValue; else: infer ElseValue }
  ? ThenValue | ElseValue
  : SchemaType extends { then: infer ThenValue }
  ? ThenValue
  : SchemaType extends { else: infer ElseValue }
  ? ElseValue
  : SchemaType extends NullTypeSchema
  ? null
  : SchemaType extends BooleanTypeSchema
  ? boolean
  : SchemaType extends NumberSchema
  ? number
  : SchemaType extends StringSchema
  ? string
  : SchemaType extends ObjectSchema
  ? ObjectSchemaProperties<SchemaType>
  : SchemaType extends ArraySchema
  ? ArraySchemaItems<SchemaType>
  : unknown

export const mapProperties = <Result>(
  transformer: (key: string, schema: Schema) => Result,
  schema: SchemaObject,
): Result[] => {
  const properties = schema.properties ?? {}
  return Object.entries(properties).map(([key, propertySchema]) => transformer(key, propertySchema))
}

export const mapItems = <Result>(
  transformer: (index: number, schema: Schema) => Result,
  schema: SchemaObject,
): Result[] => {
  const itemSchema = schema.items
  const prefixItems = schema.prefixItems ?? []
  const minItems = schema.minItems ?? 0
  const dynamicItems =
    itemSchema !== undefined
      ? Array.from({ length: minItems - prefixItems.length }, () => itemSchema)
      : []
  const items = [...prefixItems, ...dynamicItems]
  return items.map((item, index) => transformer(index, item))
}

export type ValueGenerator = {
  (schema: Schema): SchemaValue<Schema>
  <Result>(schema: Schema): Result
}

export const generateValue: ValueGenerator = (
  schema: Schema,
  defaultValues = defaults,
): unknown => {
  if (isBoolean(schema)) {
    // Behavior is like: if the schema is "true", a value should exist, but we don't know which (so: null)
    // If the schema is false, it should never have a value so we let e.g. JSON.stringify drop the property
    // alltogether if it gets serialized, as an example
    return schema === true ? null : undefined
  }

  if (schema.default !== undefined) {
    return schema.default
  }

  if (schema.const !== undefined) {
    return schema.const
  }

  if (schema.enum !== undefined) {
    return schema.enum?.[0] ?? null
  }

  // For these two composition types, we can only take the first one and generate a value for it
  if (schema.oneOf || schema.anyOf) {
    return generateValue(schema.oneOf?.[0] ?? schema.anyOf?.[0] ?? false)
  }

  // For this one, we have to combine all schemas instead
  if (schema.allOf) {
    return generateValue(
      schema.allOf.reduce<SchemaObject>(
        (combinedSchema, subSchema) => ({
          ...combinedSchema,
          ...(isObject(subSchema) ? subSchema : undefined),
        }),
        {},
      ),
    )
  }

  // For if - then - else, we render either then or else if we have it (if - else without then works like "unless")
  if (schema.then) {
    return generateValue(schema.then)
  }

  if (schema.else) {
    return generateValue(schema.else)
  }

  if (isBooleanSchema(schema)) {
    return defaultValues.boolean
  }

  if (isIntegerSchema(schema)) {
    return defaultValues.integer
  }

  if (isNumberSchema(schema)) {
    return defaultValues.number
  }

  if (isStringSchema(schema)) {
    return defaultValues.string
  }

  if (isArraySchema(schema)) {
    return mapItems((_, itemSchema) => generateValue(itemSchema), schema)
  }

  if (isObjectSchema(schema)) {
    return Object.fromEntries(
      mapProperties((key, propertySchema) => [key, generateValue(propertySchema)], schema),
    )
  }

  return null
}
