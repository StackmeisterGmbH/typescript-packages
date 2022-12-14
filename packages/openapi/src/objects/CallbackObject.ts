import type PathItemObject from './PathItemObject'
import type SpecificationExtensions from './SpecificationExtensions'

type CallbackObject = Record<string, PathItemObject> & SpecificationExtensions

export default CallbackObject
