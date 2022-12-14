import type OAuth2FlowsObject from './OAuthFlowsObject'
import type { ParameterLocation } from './ParameterObject'
import type SpecificationExtensions from './SpecificationExtensions'

export type SecuritySchemeType = 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'

export type ApiKeySecurityScheme = {
  readonly type: 'apiKey'
  readonly description?: string
  readonly name: string
  readonly in: Exclude<ParameterLocation, 'path'>
} & SpecificationExtensions

export type HttpAuthenticationScheme =
  | 'Basic'
  | 'Bearer'
  | 'Digest'
  | 'HOBA'
  | 'Mutual'
  | 'Negotiate'
  | 'OAuth'
  | 'SCRAM-SHA-1'
  | 'SCRAM-SHA-256'
  | 'vapid'

export type HttpSecurityScheme = {
  readonly type: 'http'
  readonly scheme: HttpAuthenticationScheme
  readonly bearerFormat?: string
} & SpecificationExtensions

export type OAuth2SecurityScheme = {
  readonly type: 'oauth2'
  readonly flows: OAuth2FlowsObject
} & SpecificationExtensions

export type OpenIdConnectSecurityScheme = {
  readonly type: 'openIdConnect'
  readonly openIdConnectUrl: string
} & SpecificationExtensions

type SecuritySchemeObject =
  | ApiKeySecurityScheme
  | HttpSecurityScheme
  | OAuth2SecurityScheme
  | OpenIdConnectSecurityScheme

export default SecuritySchemeObject
