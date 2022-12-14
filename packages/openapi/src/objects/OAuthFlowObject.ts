import type SpecificationExtensions from './SpecificationExtensions'

export type OAuthFlowType = 'implicit' | 'password' | 'clientCredentials' | 'authorizationCode'

export type OAuthFlowFields = {
  readonly authorizationUrl: string
  readonly tokenUrl: string
  readonly refreshUrl?: string
  readonly scopes: Record<string, string>
}

export type OAuthFlowFieldNamesForType<Type extends OAuthFlowType> = {
  implicit: 'authorizationUrl' | 'refreshUrl' | 'scopes'
  password: 'tokenUrl' | 'refreshUrl' | 'scopes'
  clientCredentials: 'tokenUrl' | 'refreshUrl' | 'scopes'
  authorizationCode: 'authorizationUrl' | 'tokenUrl' | 'refreshUrl' | 'scopes'
}[Type]

type OAuthFlowObject<Type extends OAuthFlowType> = OAuthFlowFieldNamesForType<Type> &
  SpecificationExtensions

export default OAuthFlowObject
