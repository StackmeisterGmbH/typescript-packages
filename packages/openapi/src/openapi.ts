import type { Ref, SchemaObject as JsonSchemaObject, SimpleType } from '@stackmeister/json-schema'

export type SpecificationExtensions = Record<`x-${string}`, unknown>

export type ContactObject = {
  readonly name?: string
  readonly url?: string
  readonly email?: string
} & SpecificationExtensions

export type LicenseObject = {
  readonly name: string
  readonly url?: string
} & SpecificationExtensions

export type InfoObject = {
  readonly title: string
  readonly version: string
  readonly description?: string
  readonly termsOfService?: string
  readonly contact?: ContactObject
  readonly license?: LicenseObject
} & SpecificationExtensions

export type ServerVariableObject = {
  readonly default: string
  readonly enum?: string[]
  readonly description?: string
} & SpecificationExtensions

export type ServerObject = {
  readonly url: string
  readonly description?: string
  readonly variables?: Record<string, ServerVariableObject>
} & SpecificationExtensions

export type Path = `/${string}`

export type ExternalDocumentationObject = {
  readonly url: string
  readonly description?: string
} & SpecificationExtensions

export type ParameterLocation = 'query' | 'header' | 'path' | 'cookie'

/**
 * In order to support common ways of serializing simple parameters, a set of style values are defined.
 *
 * matrix	primitive, array, object	path	Path-style parameters defined by RFC6570
 * label	primitive, array, object	path	Label style parameters defined by RFC6570
 * form	primitive, array, object	query, cookie	Form style parameters defined by RFC6570. This option replaces collectionFormat with a csv (when explode is false) or multi (when explode is true) value from OpenAPI 2.0.
 * simple	array	path, header	Simple style parameters defined by RFC6570. This option replaces collectionFormat with a csv value from OpenAPI 2.0.
 * spaceDelimited	array	query	Space separated array values. This option replaces collectionFormat equal to ssv from OpenAPI 2.0.
 * pipeDelimited	array	query	Pipe separated array values. This option replaces collectionFormat equal to pipes from OpenAPI 2.0.
 * deepObject	object	query	Provides a simple way of rendering nested objects using form parameters.
 */
export type ParameterStyle =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject'

export type DiscriminatorObject = {
  readonly propertyName: string
  readonly mapping?: Record<string, string>
}

export type XmlObject = {
  readonly name?: string
  readonly namespace?: string
  readonly prefix?: string
  readonly attribute?: boolean
  readonly wrapped?: boolean
} & SpecificationExtensions

export type SchemaType = SimpleType

export type SchemaObject = Pick<
  JsonSchemaObject,
  | 'title'
  | 'multipleOf'
  | 'maximum'
  | 'minimum'
  | 'maxLength'
  | 'minLength'
  | 'pattern'
  | 'maxItems'
  | 'minItems'
  | 'uniqueItems'
  | 'maxProperties'
  | 'minProperties'
  | 'required'
  | 'enum'
> & {
  readonly type?: SchemaType
  readonly allOf?: Array<SchemaObject | Ref>
  readonly oneOf?: Array<SchemaObject | Ref>
  readonly anyOf?: Array<SchemaObject | Ref>
  readonly not?: SchemaObject | Ref
  readonly exclusiveMinimum?: boolean
  readonly exclusiveMaximum?: boolean
  readonly items?: SchemaObject | Ref
  readonly properties?: Record<string, SchemaObject | Ref>
  readonly additionalProperties?: boolean | SchemaObject | Ref
  readonly description?: string
  readonly format?: string
  readonly default?: unknown
  readonly nullable?: boolean
  readonly discriminator?: DiscriminatorObject
  readonly readOnly?: boolean
  readonly writeOnly?: boolean
  readonly xml?: XmlObject
  readonly externalDocs?: ExternalDocumentationObject
  readonly example?: unknown
  readonly deprecated?: boolean
} & SpecificationExtensions

export type ExampleObject = {
  readonly summary?: string
  readonly description?: string
  readonly value?: unknown
  readonly externalValue?: string
} & SpecificationExtensions

export type EncodingObject = {
  readonly contentType?: string
  readonly headers?: Record<string, HeaderObject | Ref>
  readonly style?: ParameterStyle
  readonly explode?: boolean
  readonly allowReserved?: boolean
} & SpecificationExtensions

export type MediaTypeObject = {
  readonly schema?: SchemaObject | Ref
  readonly example?: unknown
  readonly examples?: Record<string, ExampleObject | Ref>
  readonly encoding?: Record<string, EncodingObject>
} & SpecificationExtensions

export type ParameterObject = {
  /**
   * REQUIRED. The name of the parameter. Parameter names are case sensitive.
   * If in is "path", the name field MUST correspond to a template expression occurring within the path field in the Paths Object.
   * See Path Templating for further information. If in is "header" and the name field is "Accept", "Content-Type" or "Authorization",
   * the parameter definition SHALL be ignored. For all other cases, the name corresponds to the parameter name used by the in property.
   */
  readonly name: string
  /**
   * REQUIRED. The location of the parameter. Possible values are "query", "header", "path" or "cookie".
   */
  readonly in: ParameterLocation
  /**
   * Determines whether this parameter is mandatory. If the parameter location is "path", this property
   * is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false.
   */
  readonly required?: boolean
  /**
   * A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.
   */
  readonly description?: string
  /**
   * Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is false.
   */
  readonly deprecated?: boolean
  /**
   * Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a
   * parameter with an empty value. Default value is false. If style is used, and if behavior is n/a (cannot be serialized),
   * the value of allowEmptyValue SHALL be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in
   * a later revision.
   */
  readonly allowEmptyValue?: boolean
  /**
   * Describes how the parameter value will be serialized depending on the type of the parameter value.
   * Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.
   */
  readonly style?: ParameterStyle
  /**
   * When this is true, parameter values of type array or object generate separate parameters for each value of the array or
   * key-value pair of the map. For other types of parameters this property has no effect. When style is form, the
   * default value is true. For all other styles, the default value is false.
   */
  readonly explode?: boolean
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&'()*+,;= to be
   * included without percent-encoding. This property only applies to parameters with an in value of query. The default value is false.
   */
  readonly allowReserved?: boolean

  /**
   * The schema defining the type used for the parameter.
   */
  readonly schema?: SchemaObject | Ref

  /**
   * Example of the parameter's potential value. The example SHOULD match the specified schema and encoding properties if present.
   * The example field is mutually exclusive of the examples field. Furthermore, if referencing a schema that contains an example,
   * the example value SHALL override the example provided by the schema. To represent examples of media types that cannot naturally
   * be represented in JSON or YAML, a string value can contain the example with escaping where necessary.
   */
  readonly example?: unknown

  /**
   * Examples of the parameter's potential value. Each example SHOULD contain a value in the correct format as specified in the
   * parameter encoding. The examples field is mutually exclusive of the example field. Furthermore, if referencing a schema
   * that contains an example, the examples value SHALL override the example provided by the schema.
   */
  readonly examples?: Record<string, ExampleObject | Ref>

  /**
   * A map containing the representations for the parameter. The key is the media type and the value describes it.
   * The map MUST only contain one entry.
   */
  readonly content?: Record<string, MediaTypeObject>
} & SpecificationExtensions

export type HeaderObject = Omit<ParameterObject, 'name' | 'in' | 'allowReserved'>

export type RequestBodyObject = {
  readonly content: Record<string, MediaTypeObject>
  readonly description?: string
  readonly required?: boolean
} & SpecificationExtensions

export type Expression = string

export type LinkObject = {
  readonly operationRef?: string
  readonly operationId?: string
  readonly parameters?: Record<string, Expression | unknown>
  readonly requestBody?: Expression | unknown
  readonly description?: string
  readonly server?: ServerObject
} & SpecificationExtensions

export type ResponseObject = {
  readonly description: string
  readonly headers?: Record<string, HeaderObject | Ref>
  readonly content?: Record<string, MediaTypeObject>
  readonly links?: Record<string, LinkObject | Ref>
} & SpecificationExtensions

export type ResponsesObject = Record<number, ResponseObject | Ref> & {
  readonly default?: ResponseObject | Ref
} & SpecificationExtensions

export type CallbackObject = Record<Expression, PathItemObject> & SpecificationExtensions

export type SecurityRequirementObject = Record<string, string[]>

export type OperationObject = {
  readonly responses: ResponsesObject
  readonly tags?: string[]
  readonly summary?: string
  readonly description?: string
  readonly externalDocs?: ExternalDocumentationObject
  readonly operationId?: string
  readonly parameters?: Array<ParameterObject | Ref>
  readonly requestBody?: RequestBodyObject | Ref
  readonly callbacks?: Record<string, CallbackObject | Ref>
  readonly deprecated?: boolean
  readonly security?: SecurityRequirementObject
  readonly servers?: ServerObject[]
} & SpecificationExtensions

export type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'

export type PathItemObject = Partial<Ref> &
  Partial<Record<Method, OperationObject>> & {
    readonly summary?: string
    readonly description?: string
    readonly servers?: ServerObject[]
    readonly parameters?: Array<ParameterObject | Ref>
  } & SpecificationExtensions

export type PathsObject = Record<Path, PathItemObject> & SpecificationExtensions

export type SecuritySchemeType = 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'

export type ApiKeySecurityScheme = {
  readonly type: 'apiKey'
  readonly description?: string
  readonly name: string
  readonly in: Exclude<ParameterLocation, 'path'>
}

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

export type HttpApiSecurityScheme = {
  readonly type: 'http'
  readonly scheme: HttpAuthenticationScheme
  readonly bearerFormat?: string
}

export type ImplicitOAuth2FlowObject = {
  readonly authorizationUrl: string
  readonly refreshUrl?: string
  readonly scopes: Record<string, string>
} & SpecificationExtensions

export type PasswordOAuth2FlowObject = {
  readonly tokenUrl: string
  readonly refreshUrl?: string
  readonly scopes: Record<string, string>
} & SpecificationExtensions

export type ClientCredentialsOAuth2FlowObject = {
  readonly tokenUrl: string
  readonly refreshUrl?: string
  readonly scopes: Record<string, string>
} & SpecificationExtensions

export type AuthorizationCodeOAuth2FlowObject = {
  readonly authorizationUrl: string
  readonly tokenUrl: string
  readonly refreshUrl?: string
  readonly scopes: Record<string, string>
} & SpecificationExtensions

export type OAuth2FlowsObject = {
  readonly implicit?: ImplicitOAuth2FlowObject
  readonly password?: PasswordOAuth2FlowObject
  readonly clientCredentials?: ClientCredentialsOAuth2FlowObject
  readonly authorizationCode?: AuthorizationCodeOAuth2FlowObject
} & SpecificationExtensions

export type OAuth2ApiSecurityScheme = {
  readonly type: 'oauth2'
  readonly flows: OAuth2FlowsObject
}

export type OpenIdConnectApiSecurityScheme = {
  readonly type: 'openIdConnect'
  readonly openIdConnectUrl: string
}

export type SecuritySchemeObject = (
  | ApiKeySecurityScheme
  | HttpApiSecurityScheme
  | OAuth2ApiSecurityScheme
  | OpenIdConnectApiSecurityScheme
) &
  SpecificationExtensions

export type ComponentsObject = {
  readonly schemas?: Record<string, SchemaObject | Ref>
  readonly responses?: Record<string, ResponseObject | Ref>
  readonly parameters?: Record<string, ParameterObject | Ref>
  readonly examples?: Record<string, ExampleObject | Ref>
  readonly requestBodies?: Record<string, RequestBodyObject | Ref>
  readonly headers?: Record<string, HeaderObject | Ref>
  readonly securitySchemes?: Record<string, SecuritySchemeObject | Ref>
  readonly links?: Record<string, LinkObject | Ref>
  readonly callbacks?: Record<string, CallbackObject | Ref>
} & SpecificationExtensions

export type TagObject = {
  readonly name: string
  readonly description?: string
  readonly externalDocs?: ExternalDocumentationObject
} & SpecificationExtensions

export type Document = {
  readonly openapi: string
  readonly info: InfoObject
  readonly servers?: ServerObject[]
  readonly paths: PathsObject
  readonly components?: ComponentsObject
  readonly security?: SecurityRequirementObject[]
  readonly tags?: TagObject[]
  readonly externalDocs?: ExternalDocumentationObject
} & SpecificationExtensions
