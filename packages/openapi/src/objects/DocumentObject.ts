import type ComponentsObject from './ComponentsObject'
import type ExternalDocumentationObject from './ExternalDocumentationObject'
import type InfoObject from './InfoObject'
import type PathsObject from './PathsObject'
import type SecurityRequirementObject from './SecurityRequirementObject'
import type ServerObject from './ServerObject'
import type SpecificationExtensions from './SpecificationExtensions'
import type TagObject from './TagObject'

type DocumentObject = {
  readonly openapi: string
  readonly info: InfoObject
  readonly servers?: ServerObject[]
  readonly paths: PathsObject
  readonly components?: ComponentsObject
  readonly security?: SecurityRequirementObject[]
  readonly tags?: TagObject[]
  readonly externalDocs?: ExternalDocumentationObject
} & SpecificationExtensions

export default DocumentObject
