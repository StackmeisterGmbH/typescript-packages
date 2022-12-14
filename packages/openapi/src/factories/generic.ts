import type ReferenceObject from '../objects/ReferenceObject'
import type SchemaObject from '../objects/SchemaObject'

export const withProperty =
  <PropertyValue>() =>
  <Key extends string>(key: Key) =>
  (propertyValue: PropertyValue) =>
  <Value extends { [K in Key]?: PropertyValue } | ReferenceObject>(value: Value): Value => ({
    ...value,
    [key]: propertyValue,
  })

export const withSchema = withProperty<SchemaObject | ReferenceObject>()('schema')
export const withDescription = withProperty<string>()('description')
