import type { Validator } from '../validation'
import type { ContextTransformer } from '../contexts'
import { isBoolean, isString } from '@stackmeister/types'
import { dropComponents, resolve as resolveUri } from '@stackmeister/uri'
import { invalidOutput } from '../outputs'

/**
 * @category Context Transformer Core
 */
export const coreContextTransformers: Record<string, ContextTransformer> = {
  $id: (schema, context) => {
    if (isBoolean(schema) || !isString(schema.$id)) {
      return context
    }
    // Dynamic schema registration during validation
    const newBaseIri = dropComponents(['fragment'], resolveUri(context.baseIri, schema.$id))
    return {
      ...context,
      baseIri: newBaseIri,
    }
  },
}

/**
 * @category Validator Core
 */
export const coreValidators: Record<string, Validator> = {
  // Boolean schema validation (simply, true and false are valid schemas)
  // a "true" schema does not produce any output (It's the same as {}, so no validators kick in and it always stays valid)
  $: (schema, _, context) => {
    if (schema === false) {
      return invalidOutput([], context.error`Must not be any value`, context)
    }

    return null
  },
}
