import type ExternalDocumentationObject from './ExternalDocumentationObject'
import type SpecificationExtensions from './SpecificationExtensions'

type TagObject = {
  readonly name: string
  readonly description?: string
  readonly externalDocs?: ExternalDocumentationObject
} & SpecificationExtensions

export default TagObject
