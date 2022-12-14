import type SpecificationExtensions from './SpecificationExtensions'

type LicenseObject = {
  readonly name: string
  readonly url?: string
} & SpecificationExtensions

export default LicenseObject
