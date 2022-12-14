import type PathItemObject from './PathItemObject'
import type SpecificationExtensions from './SpecificationExtensions'

export type Path = `/${string}`

type PathsObject = Record<Path, PathItemObject> & SpecificationExtensions

export default PathsObject
