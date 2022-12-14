import type OperationObject from './OperationObject'
import type ParameterObject from './ParameterObject'
import type ReferenceObject from './ReferenceObject'
import type ServerObject from './ServerObject'
import type SpecificationExtensions from './SpecificationExtensions'

export type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

type PathItemObject = Partial<ReferenceObject> &
  Partial<Record<Method, OperationObject>> & {
    readonly summary?: string
    readonly description?: string
    readonly servers?: ServerObject[]
    readonly parameters?: Array<ParameterObject | ReferenceObject>
  } & SpecificationExtensions

export default PathItemObject
