import type ServerVariableObject from './ServerVariableObject'
import type SpecificationExtensions from './SpecificationExtensions'

type ServerObject = {
  readonly url: string
  readonly description?: string
  readonly variables?: Record<string, ServerVariableObject>
} & SpecificationExtensions

export default ServerObject
