import type { Context } from './contexts'
import type {
  BasicOutput,
  DetailedOutput,
  FlagOutput,
  OutputUnit,
  VerboseOutput,
} from './standard/output/schema'

/**
 * Creates an output structure that validators can return.
 *
 * Most of the time, you might want to use one of its descendants,
 * {@linkcode invalidOutput} or {@linkcode validOutput} instead.
 *
 * @category Output
 *
 * @param data The output data following the JSON-Schema Output schema.
 * @param context The current validation context.
 * @returns a validation output structure.
 */
const output = (data: Partial<OutputUnit>, context: Context): VerboseOutput => ({
  absoluteKeywordLocation: `${context.baseIri}#${context.keywordLocation}`,
  valid: true,
  keywordLocation: context.keywordLocation,
  instanceLocation: context.instanceLocation,
  ...data,
})

/**
 * Creates an output structure for failed validations that validators can return.
 *
 * @category Output
 *
 * @param errors The inner errors for this failure output.
 * @param error The error message for this failure output.
 * @param context The current validation context.
 * @returns A failure output structure.
 */
export const invalidOutput = (
  errors: VerboseOutput[],
  error: string,
  context: Context,
): VerboseOutput =>
  output({ valid: false, error, ...(errors.length > 0 ? { errors } : {}) }, context)

/**
 * Creates an output structure for successful validations that validators can return.
 *
 * @category Output
 *
 * @param annotations The inner validation outputs for this success output.
 * @param context The current validation context.
 * @returns a success output structure.
 */
export const validOutput = (annotations: VerboseOutput[], context: Context): VerboseOutput =>
  output({ valid: true, ...(annotations.length > 0 ? { annotations } : {}) }, context)

/**
 * Correctly combines a collection of outputs to a single output unit.
 *
 * Errors will end up as "errors", successes will end up as "annotations".
 * If any of the inner outputs is not valid, the combined output won't be valid, either.
 *
 * @category Output
 *
 * @param outputs The output collection to combine.
 * @param error The error message for the combined error.
 * @param context The current validation context.
 * @returns the combined output.
 */
export const combineOutputs = (
  outputs: VerboseOutput[],
  error: string,
  context: Context,
): VerboseOutput => {
  const valid = outputs.every(childOutput => childOutput.valid)
  const annotations = outputs.filter(childOutput => childOutput.valid)
  const errors = outputs.filter(childOutput => !childOutput.valid)
  return output(
    {
      valid,
      ...(annotations.length > 0 ? { annotations } : undefined),
      ...(errors.length > 0 ? { errors } : undefined),
      ...(!valid && error !== undefined ? { error } : undefined),
    },
    context,
  )
}

/**
 * Turns a VerboseOutput failure output into a flat BasicOutput.
 *
 * It will drop all its inner errors.
 *
 * @category Output Utility
 * @internal
 *
 * @param value The failure error output.
 * @returns A flat BasicOutput representing the error.
 */
const flatError = (value: VerboseOutput): BasicOutput => {
  return {
    valid: value.valid,
    keywordLocation: value.keywordLocation,
    absoluteKeywordLocation: value.absoluteKeywordLocation,
    instanceLocation: value.instanceLocation,
    error: value.error,
  }
}

/**
 * Will keep only error outputs of the provided output collection.
 *
 * @category Output Utility
 * @internal
 *
 * @param errors The collection of error outputs to filter.
 * @returns A filtered collection only containing errors.
 */
const onlyErrors = (errors: ReadonlyArray<OutputUnit>): ReadonlyArray<BasicOutput> =>
  errors
    .filter(error => !error.valid)
    .map(error => (error.errors ? { ...error, errors: onlyErrors(error.errors) } : error))

/**
 * Flattens an array of VerboseOutput structures to an array of BasicOutput structures.
 *
 * Inner errors will be flattened into a single collection.
 *
 * @category Output Utility
 * @internal
 *
 * @param errors The collection of error outputs.
 * @returns A collection of BasicOutputs of the passed VerboseOutputs.
 */
const flattenBasic = (errors: ReadonlyArray<VerboseOutput>): ReadonlyArray<BasicOutput> =>
  errors
    .filter(error => !error.valid)
    .flatMap(error => [flatError(error), ...(error?.errors ? flattenBasic(error.errors) : [])])

/**
 * Converts a VerboseOutput to a FlagOutput.
 *
 * @category Output Utility
 *
 * @param output An output structure to convert.
 * @returns The converted FlagOutput structure.
 */
export const toFlagOutput = (targetOutput: VerboseOutput): FlagOutput => ({
  valid: targetOutput.valid,
})

/**
 * Converts a VerboseOutput to a BasicOutput.
 *
 * @category Output Utility
 *
 * @param output An output structure to convert.
 * @returns The converted BasicOutput structure.
 */
export const toBasicOutput = (targetOutput: VerboseOutput): BasicOutput => ({
  valid: targetOutput.valid,
  keywordLocation: targetOutput.keywordLocation,
  instanceLocation: targetOutput.instanceLocation,
  ...(!targetOutput.valid
    ? {
        errors: flattenBasic([targetOutput]),
      }
    : undefined),
})

/**
 * Converts a VerboseOutput to a DetailedOutput.
 *
 * @category Output Utility
 *
 * @param output An output structure to convert.
 * @returns The converted DetailedOutput structure.
 */
export const toDetailedOutput = (targetOutput: VerboseOutput): DetailedOutput => ({
  valid: targetOutput.valid,
  keywordLocation: targetOutput.keywordLocation,
  absoluteKeywordLocation: targetOutput.absoluteKeywordLocation,
  instanceLocation: targetOutput.instanceLocation,
  ...(!targetOutput.valid
    ? {
        errors: onlyErrors(targetOutput.errors ?? []),
      }
    : undefined),
})
