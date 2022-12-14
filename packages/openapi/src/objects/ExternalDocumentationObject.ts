import type SpecificationExtensions from './SpecificationExtensions'

type ExternalDocumentationObject = {
  readonly url: string
  readonly description?: string
} & SpecificationExtensions

export default ExternalDocumentationObject
