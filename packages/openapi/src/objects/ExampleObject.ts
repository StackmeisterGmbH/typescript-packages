import type SpecificationExtensions from './SpecificationExtensions'

type ExampleObject = {
  readonly summary?: string
  readonly description?: string
  readonly value?: unknown
  readonly externalValue?: string
} & SpecificationExtensions

export default ExampleObject
