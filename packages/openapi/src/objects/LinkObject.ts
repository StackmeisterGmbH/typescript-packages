import type ServerObject from './ServerObject'
import type SpecificationExtensions from './SpecificationExtensions'

type LinkObject = {
  readonly operationRef?: string
  readonly operationId?: string
  readonly parameters?: Record<string, string | unknown>
  readonly requestBody?: string | unknown
  readonly description?: string
  readonly server?: ServerObject
} & SpecificationExtensions

export default LinkObject
