import type ReferenceObject from './ReferenceObject'
import type ResponseObject from './ResponseObject'
import type SpecificationExtensions from './SpecificationExtensions'

type ResponsesObject = Record<number, ResponseObject | ReferenceObject> & {
  readonly default?: ResponseObject | ReferenceObject
} & SpecificationExtensions

export default ResponsesObject
