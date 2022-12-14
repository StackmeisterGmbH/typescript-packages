import type HeaderObject from './HeaderObject'
import type LinkObject from './LinkObject'
import type MediaTypeObject from './MediaTypeObject'
import type ReferenceObject from './ReferenceObject'
import type SpecificationExtensions from './SpecificationExtensions'

type ResponseObject = {
  readonly description: string
  readonly headers?: Record<string, HeaderObject | ReferenceObject>
  readonly content?: Record<string, MediaTypeObject>
  readonly links?: Record<string, LinkObject | ReferenceObject>
} & SpecificationExtensions

export default ResponseObject
