import type { Schema } from './standard/meta/schema'
import type { Context, ValidationOptions } from './contexts'
import { createContext } from './contexts'
import type {
  BasicOutput,
  DetailedOutput,
  FlagOutput,
  OutputUnit,
  VerboseOutput,
} from './standard/output/schema'
import { combineOutputs, toBasicOutput, toDetailedOutput, toFlagOutput } from './outputs'
import { deref } from '@stackmeister/json-ref'

export { deref }

/**
 * A validation function that takes a schema and a value and will provide an output.
 *
 * The validator has to check for itself it is applicable for the given schema.
 * If it is not applicable, it is supposed to return null (as in "abstain from validation").
 *
 * @category Validation
 *
 */
export type Validator = (schema: Schema, value: unknown, context: Context) => VerboseOutput | null

/**
 * Performans validation of a value with a given schema.
 *
 * You have to pass a fully configured context to this function. If you don't know where to get it,
 * you probably want to use `validateVerbose`, `validateDetailed`, `validateBasic` or `validateFlag` instead.
 *
 * @category Validation
 *
 * @see {validateVerbose}
 * @see {validateDetailed}
 * @see {validateBasic}
 * @see {validateFlag}
 *
 * @param schema The schema to validate against.
 * @param value The value to validate.
 * @param context A fully configured validation context.
 * @returns
 */
export const validateWithContext = (
  schema: Schema,
  value: unknown,
  context: Context,
): VerboseOutput => {
  // Transform context (e.g. update baseUri when one is encountered)
  const transformedContext = Object.values(context.contextTransformers).reduce(
    (resultContext, transform) => transform(schema, resultContext),
    context,
  )
  const validations = Object.values(context.validators).map(validate =>
    validate(schema, value, transformedContext),
  )
  const outputs = validations.filter(result => result !== null) as OutputUnit[]
  return combineOutputs(outputs, transformedContext.error`Validation failed`, transformedContext)
}

/**
 * Validates a value against a schema and returns a very verbose analysis output structure.x
 *
 * This is mostly useful for debugging or for keeping all related information.
 *
 * See {@link VerboseOutput}
 *
 * @category Validation
 *
 * @param schema The schema to validate against.
 * @param value The value to validate.
 * @param options A very verbose output structure with information how the validation went.
 * @returns
 */
export const validateVerbose = <SchemaType extends Schema>(
  schema: SchemaType,
  value: unknown,
  options?: ValidationOptions,
): VerboseOutput => {
  return validateWithContext(schema, value, createContext(options))
}

/**
 * Validates a value against a schema and returns a detailed analysis output structure.
 *
 * See {@link DetailedOutput}
 *
 * @category Validation
 *
 * @param schema The schema to validate against.
 * @param value The value to validate.
 * @param options A detailed output structure with information how the validation went.
 * @returns
 */
export const validateDetailed = (
  schema: Schema,
  value: unknown,
  options?: ValidationOptions,
): DetailedOutput => toDetailedOutput(validateVerbose(schema, value, options))

/**
 * Validates a value against a schema and returns a basic analysis output structure.
 *
 * See {@link BasicOutput}
 *
 * @category Validation
 *
 * @param schema The schema to validate against.
 * @param value The value to validate.
 * @param options A basic output structure with information how the validation went.
 * @returns
 */
export const validateBasic = (
  schema: Schema,
  value: unknown,
  options?: ValidationOptions,
): BasicOutput => toBasicOutput(validateVerbose(schema, value, options))

/**
 * Validates a value against a schema and returns a basic analysis output structure.
 *
 * See {@link FlagOutput}
 *
 * @category Validation
 *
 * @param schema The schema to validate against.
 * @param value The value to validate.
 * @param options A basic output structure with information how the validation went.
 * @returns
 */
export const validateFlag = (
  schema: Schema,
  value: unknown,
  options?: ValidationOptions,
): FlagOutput => toFlagOutput(validateVerbose(schema, value, options))
