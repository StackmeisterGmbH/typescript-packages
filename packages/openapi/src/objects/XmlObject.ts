import type SpecificationExtensions from './SpecificationExtensions'

type XmlObject = {
  readonly name?: string
  readonly namespace?: string
  readonly prefix?: string
  readonly attribute?: boolean
  readonly wrapped?: boolean
} & SpecificationExtensions

export default XmlObject
