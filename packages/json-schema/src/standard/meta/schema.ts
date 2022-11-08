import type { ApplicatorProperties } from './applicator'
import type { ContentProperties } from './content'
import type { CoreProperties } from './core'
import type { FormatAnnotationProperties } from './formatAnnotation'
import type { MetaDataProperties } from './metaData'
import type { UnevaluatedProperties } from './unevaluated'
import type { ValidationProperties } from './validation'

/**
 * Represents a full schema object.
 *
 * Notice a Schema can also be a boolean, this type does not include the boolean.
 *
 * Most of the time, you want to use {@link Schema} instead.
 *
 * @category JSON-Schema Property
 */
export type SchemaObject<Value = unknown> = CoreProperties &
  ApplicatorProperties<Value> &
  UnevaluatedProperties<Value> &
  ValidationProperties<Value> &
  MetaDataProperties<Value> &
  FormatAnnotationProperties &
  ContentProperties

/**
 * Represents a JSON-Schema and all of its possible properties.
 *
 * Notice a schema can also be a simple boolean.
 *
 * If you want a schema type that is always an object, use {@link SchemaObject} instead.
 *
 * @category JSON-Schema
 *
 * @template Value The type of a value this schema represents.
 */
export type Schema<Value = unknown> = SchemaObject<Value> | boolean
