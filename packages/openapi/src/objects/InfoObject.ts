import type ContactObject from './ContactObject'
import type LicenseObject from './LicenseObject'
import type SpecificationExtensions from './SpecificationExtensions'

type InfoObject = {
  readonly title: string
  readonly version: string
  readonly description?: string
  readonly termsOfService?: string
  readonly contact?: ContactObject
  readonly license?: LicenseObject
} & SpecificationExtensions

export default InfoObject
