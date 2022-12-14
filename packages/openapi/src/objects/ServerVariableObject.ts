import type SpecificationExtensions from './SpecificationExtensions'

type ServerVariableObject = {
  readonly default: string
  readonly enum?: string[]
  readonly description?: string
} & SpecificationExtensions

export default ServerVariableObject
