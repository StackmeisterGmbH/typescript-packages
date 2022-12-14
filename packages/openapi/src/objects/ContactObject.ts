import type SpecificationExtensions from './SpecificationExtensions'

type ContactObject = {
  readonly name?: string
  readonly url?: string
  readonly email?: string
} & SpecificationExtensions

export default ContactObject
