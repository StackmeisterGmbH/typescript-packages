import type EncodingObject from './EncodingObject'
import type ExampleObject from './ExampleObject'
import type ReferenceObject from './ReferenceObject'
import type SchemaObject from './SchemaObject'
import type SpecificationExtensions from './SpecificationExtensions'

type MediaTypeObject = {
  readonly schema?: SchemaObject | ReferenceObject
  readonly example?: unknown
  readonly examples?: Record<string, ExampleObject | ReferenceObject>
  readonly encoding?: Record<string, EncodingObject>
} & SpecificationExtensions

export default MediaTypeObject
