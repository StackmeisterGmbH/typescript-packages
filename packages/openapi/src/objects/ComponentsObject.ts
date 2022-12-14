import type CallbackObject from './CallbackObject'
import type ExampleObject from './ExampleObject'
import type HeaderObject from './HeaderObject'
import type LinkObject from './LinkObject'
import type ParameterObject from './ParameterObject'
import type ReferenceObject from './ReferenceObject'
import type RequestBodyObject from './RequestBodyObject'
import type ResponseObject from './ResponseObject'
import type SchemaObject from './SchemaObject'
import type SecuritySchemeObject from './SecuritySchemeObject'
import type SpecificationExtensions from './SpecificationExtensions'

type ComponentsObject = {
  readonly schemas?: Record<string, SchemaObject | ReferenceObject>
  readonly responses?: Record<string, ResponseObject | ReferenceObject>
  readonly parameters?: Record<string, ParameterObject | ReferenceObject>
  readonly examples?: Record<string, ExampleObject | ReferenceObject>
  readonly requestBodies?: Record<string, RequestBodyObject | ReferenceObject>
  readonly headers?: Record<string, HeaderObject | ReferenceObject>
  readonly securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>
  readonly links?: Record<string, LinkObject | ReferenceObject>
  readonly callbacks?: Record<string, CallbackObject | ReferenceObject>
} & SpecificationExtensions

export default ComponentsObject
