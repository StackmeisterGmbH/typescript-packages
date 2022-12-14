import type { SchemaObject as JsonSchemaObject, SimpleType } from '@stackmeister/json-schema'
import type DiscriminatorObject from './DiscriminatorObject'
import type ExternalDocumentationObject from './ExternalDocumentationObject'
import type ReferenceObject from './ReferenceObject'
import type SpecificationExtensions from './SpecificationExtensions'
import type XmlObject from './XmlObject'

export type SchemaType = SimpleType

type OpenApiSchemaObject = Pick<
  JsonSchemaObject,
  | 'title'
  | 'multipleOf'
  | 'maximum'
  | 'minimum'
  | 'maxLength'
  | 'minLength'
  | 'pattern'
  | 'maxItems'
  | 'minItems'
  | 'uniqueItems'
  | 'maxProperties'
  | 'minProperties'
  | 'required'
  | 'enum'
> & {
  readonly type?: SchemaType
  readonly allOf?: Array<SchemaObject | ReferenceObject>
  readonly oneOf?: Array<SchemaObject | ReferenceObject>
  readonly anyOf?: Array<SchemaObject | ReferenceObject>
  readonly not?: SchemaObject | ReferenceObject
  readonly exclusiveMinimum?: boolean
  readonly exclusiveMaximum?: boolean
  readonly items?: SchemaObject | ReferenceObject
  readonly properties?: Record<string, SchemaObject | ReferenceObject>
  readonly additionalProperties?: boolean | SchemaObject | ReferenceObject
  readonly description?: string
  readonly format?: string
  readonly default?: unknown
  readonly nullable?: boolean
  readonly discriminator?: DiscriminatorObject
  readonly readOnly?: boolean
  readonly writeOnly?: boolean
  readonly xml?: XmlObject
  readonly externalDocs?: ExternalDocumentationObject
  readonly example?: unknown
  readonly deprecated?: boolean
}

type SchemaObject = (OpenApiSchemaObject | JsonSchemaObject) & SpecificationExtensions

export default SchemaObject
