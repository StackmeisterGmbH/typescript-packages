import type { Schema } from './standard/meta/schema'
import type { Validator } from './validation'
import type { FormatValidators } from './validators/formatAnnotation'
import type { Iri, IriReference } from '@stackmeister/json-ref'
import { coreContextTransformers, coreValidators } from './validators/core'
import formatAnnotationValidators, { standardFormatValidators } from './validators/formatAnnotation'
import { applicatorValidators } from './validators/applicator'
import validationValidators from './validators/validation'
import { unevaluatedValidators } from './validators/unevaluated'

/**
 * A function that transforms the validation context based on a schema given.
 *
 * @category Context
 */
export type ContextTransformer = (schema: Schema, context: Context) => Context

/**
 * @category Context Error Tag
 */
export type ErrorTag = (strings: TemplateStringsArray, ...params: ReadonlyArray<unknown>) => string

/**
 * The context of the validator.
 *
 * It will be progressively enriched during validation.
 *
 * It also contains the configuration passed to the validator.
 *
 * @category Context
 */
export type Context = {
  readonly baseIri: string
  readonly keywordLocation: IriReference
  readonly instanceLocation: IriReference
  readonly validators: Record<string, Validator>
  readonly formatValidators: FormatValidators
  readonly contextTransformers: Record<string, ContextTransformer>
  readonly error: ErrorTag
}

/**
 * The options for a validator.
 *
 * These are essentially the same as ValidationContext, but all of them are optional.
 * You can configure the "initial validation context" with this.
 *
 * @category Context
 */
export type ValidationOptions = Partial<Context>

/**
 * @category Context
 */
export const standardValidators = {
  ...coreValidators,
  ...applicatorValidators,
  ...validationValidators,
  ...formatAnnotationValidators,
  ...unevaluatedValidators,
}

/**
 * @category Context Transformation
 */
export const setBaseUri = (baseUri: Iri, context: Context): Context => ({
  ...context,
  baseIri: baseUri,
})

/**
 * Creates a default context for validation. Use it to pass additional options to the validator.
 *
 * @category Context Transformation
 *
 * @param options A very verbose output structure with information how the validation went.
 * @returns The full validation context with all properties defined.
 */
export const createContext = (options?: ValidationOptions): Context => ({
  baseIri: options?.baseIri ?? '',
  keywordLocation: options?.keywordLocation ?? '',
  instanceLocation: options?.instanceLocation ?? '',
  validators: {
    ...standardValidators,
    ...options?.validators,
  },
  contextTransformers: {
    ...coreContextTransformers,
    ...options?.contextTransformers,
  },
  formatValidators: { ...standardFormatValidators, ...options?.formatValidators },
  error: options?.error ?? jsonError,
})

/**
 * A validator is supposed to use this when it enters a keyword in the JSON-schema.
 *
 * e.g. if a validator does a validation on "items", it's supposed to
 * `newContext = enterKeyword('items', currentContext)`.
 *
 * Array indexes count as keywords, too.
 *
 * @category Context Transformation
 *
 * @param keyword The key/index of the schema to enter
 * @param context The current validation context.
 * @returns
 */
export const enterKeyword = (keyword: string | number, context: Context): Context => ({
  ...context,
  keywordLocation: `${context.keywordLocation}/${keyword}`,
})

/**
 * A validator is supposed to use this when it enters a keyword in the value it's validating.
 *
 * e.g. if a validator checks a value in a sub-key, it's supposed to
 * `newContext = enterInstance(theKey, currentContext)`.
 *
 * Array indexes count as keywords, too.
 *
 * @category Context Transformation
 *
 * @param keyword The key/index of the value to enter.
 * @param context The current validation context.
 * @returns
 */
export const enterInstance = (key: string | number, context: Context): Context => ({
  ...context,
  instanceLocation: `${context.instanceLocation}/${key}`,
})

/**
 * Enters a key in the JSON-schema and the validated value at the same time.
 *
 * This does what {@linkcode enterKey} and {@linkcode enterKeyword} do, but both at the same time.
 *
 * @category Context Transformation
 *
 * @param key The key to enter in both, the JSON-schema and the validated value.
 * @param context The current validation context.
 * @returns
 */
export const enterBoth = (key: string | number, context: Context): Context => ({
  ...context,
  keywordLocation: `${context.keywordLocation}/${key}`,
  instanceLocation: `${context.instanceLocation}/${key}`,
})

/**
 * An error factory template tag that will convert interpolated values to JSON.
 *
 * You're supposed to use it as a tagged template string, so e.g.
 *
 * `jsonError\`Something ${'bad'} occured\``
 *
 * @category Context Error Tag
 *
 * @param strings The template strings.
 * @param params The values between strings, in order.
 * @returns the interpolated string.
 */
export const jsonError: ErrorTag = (strings, ...params): string =>
  strings
    .map(
      (string, index) => `${string}${index < params.length ? JSON.stringify(params[index]) : ''}`,
    )
    .join('')
