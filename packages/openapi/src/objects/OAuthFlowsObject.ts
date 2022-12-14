import type { OAuthFlowType } from './OAuthFlowObject'
import type OAuthFlowObject from './OAuthFlowObject'
import type SpecificationExtensions from './SpecificationExtensions'

type OAuth2FlowsObject = {
  readonly [Type in OAuthFlowType]: OAuthFlowObject<Type>
} & SpecificationExtensions

export default OAuth2FlowsObject
