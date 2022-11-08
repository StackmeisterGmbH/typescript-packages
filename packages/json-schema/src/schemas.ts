import type {
  Ref,
  RefRoot,
  RefAnchor,
  AnchorString,
  IriReference,
} from '@stackmeister/json-ref'
import type { Schema } from './standard/meta/schema'

export type { Ref, RefRoot, RefAnchor }

/**
 * @category Schema Type
 */
export type RecursiveRef<Iri extends IriReference = IriReference> = {
  readonly $recursiveRef: Iri
}

/**
 * @category Schema Type
 */
export type DynamicRef<Iri extends IriReference = IriReference> = {
  readonly $dynamicRef: Iri
}

/**
 * @category Schema Type
 */
export type RecursiveAnchor<Name extends AnchorString = AnchorString> = {
  readonly $recursiveAnchor: Name
}

/**
 * @category Schema Type
 */
export type DynamicAnchor<Name extends AnchorString = AnchorString> = {
  readonly $dynamicAnchor: Name
}

/**
 * @category Schema Type
 */
export type AnySchema = true | Record<string, never>

/**
 * @category Schema Type
 */
export type NoneSchema = false | NotSchema<AnySchema>

/**
 * @category Schema Type
 */
export type AllOfSchema<SchemaTypes extends Schema[]> = { readonly allOf: SchemaTypes }

/**
 * @category Schema Type
 */
export type AnyOfSchema<SchemaTypes extends Schema[]> = { readonly anyOf: SchemaTypes }

/**
 * @category Schema Type
 */
export type OneOfSchema<SchemaTypes extends Schema[]> = { readonly oneOf: SchemaTypes }

/**
 * @category Schema Type
 */
export type NotSchema<SchemaType extends Schema> = { readonly not: SchemaType }

/**
 * @category Schema Type
 */
export type IfThenSchema<IfSchemaType extends Schema, ThenSchemaType extends Schema> = {
  readonly if: IfSchemaType
  readonly then?: ThenSchemaType
}

/**
 * @category Schema Type
 */
export type IfThenElseSchema<
  IfSchemaType extends Schema,
  ThenSchemaType extends Schema,
  ElseSchemaType extends Schema,
> = {
  readonly if: IfSchemaType
  readonly then?: ThenSchemaType
  readonly else?: ElseSchemaType
}

/**
 * @category Schema Type
 */
export type NullTypeSchema = { readonly type: 'null' }

/**
 * @category Schema Type
 */
export type BooleanTypeSchema = { readonly type: 'boolean' }

/**
 * @category Schema Type
 */
export type StringTypeSchema = { readonly type: 'string' }

/**
 * @category Schema Type
 */
export type NumberTypeSchema = { readonly type: 'number' }

/**
 * @category Schema Type
 */
export type IntegerTypeSchema = { readonly type: 'integer' }

/**
 * @category Schema Type
 */
export type ArrayTypeSchema = { readonly type: 'array' }

/**
 * @category Schema Type
 */
export type ArrayItemsTypeSchema = ArrayTypeSchema & { readonly items: Schema }

/**
 * @category Schema Type
 */
export type ObjectTypeSchema = { readonly type: 'object' }
