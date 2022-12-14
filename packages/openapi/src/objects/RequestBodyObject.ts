import type MediaTypeObject from './MediaTypeObject'
import type SpecificationExtensions from './SpecificationExtensions'

type RequestBodyObject = {
  readonly content: Record<string, MediaTypeObject>
  readonly description?: string
  readonly required?: boolean
} & SpecificationExtensions

export default RequestBodyObject
