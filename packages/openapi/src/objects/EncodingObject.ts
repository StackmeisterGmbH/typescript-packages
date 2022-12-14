import type HeaderObject from './HeaderObject'
import type { ParameterStyle } from './ParameterObject'
import type ReferenceObject from './ReferenceObject'
import type SpecificationExtensions from './SpecificationExtensions'

type EncodingObject = {
  readonly contentType?: string
  readonly headers?: Record<string, HeaderObject | ReferenceObject>
  readonly style?: ParameterStyle
  readonly explode?: boolean
  readonly allowReserved?: boolean
} & SpecificationExtensions

export default EncodingObject
