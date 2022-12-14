import type CallbackObject from './CallbackObject'
import type ExternalDocumentationObject from './ExternalDocumentationObject'
import type ParameterObject from './ParameterObject'
import type ReferenceObject from './ReferenceObject'
import type RequestBodyObject from './RequestBodyObject'
import type ResponsesObject from './ResponsesObject'
import type SecurityRequirementObject from './SecurityRequirementObject'
import type ServerObject from './ServerObject'
import type SpecificationExtensions from './SpecificationExtensions'

type OperationObject = {
  readonly responses: ResponsesObject
  readonly tags?: string[]
  readonly summary?: string
  readonly description?: string
  readonly externalDocs?: ExternalDocumentationObject
  readonly operationId?: string
  readonly parameters?: Array<ParameterObject | ReferenceObject>
  readonly requestBody?: RequestBodyObject | ReferenceObject
  readonly callbacks?: Record<string, CallbackObject | ReferenceObject>
  readonly deprecated?: boolean
  readonly security?: SecurityRequirementObject
  readonly servers?: ServerObject[]
} & SpecificationExtensions

export default OperationObject
