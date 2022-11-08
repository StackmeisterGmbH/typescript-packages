import type { SimpleType } from '../standard/meta/validation'
import type { Validator } from '../validation'
import { validateFlag } from '../validation'
import {
  isNull,
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject,
  isInteger,
} from '@stackmeister/types'
import equals from '@stackmeister/equals'
import { combineOutputs, invalidOutput, validOutput } from '../outputs'
import { enterInstance, enterKeyword } from '../contexts'
import { isSchema } from '../predicates'

/**
 * @category Validator
 * @internal
 */
export const getValueSimpleType = (value: unknown): SimpleType => {
  if (isNull(value)) {
    return 'null'
  }
  if (isBoolean(value)) {
    return 'boolean'
  }
  if (isNumber(value)) {
    return 'number'
  }
  if (isString(value)) {
    return 'string'
  }
  if (isArray(value)) {
    return 'array'
  }
  return 'object'
}

/**
 * @category Validator
 */
export const validationValidators: Record<string, Validator> = {
  // type
  type: (schema, value, context) => {
    // Only acts on string or array values
    if (isBoolean(schema) || !(isString(schema.type) || isArray(schema.type))) {
      return null
    }

    const localContext = enterKeyword('type', context)
    const allowedTypes = isArray(schema.type) ? schema.type : [schema.type]
    const isAllowedType = allowedTypes.some(type => {
      switch (type) {
        case 'null':
          return isNull(value)
        case 'boolean':
          return isBoolean(value)
        case 'integer':
          return isInteger(value)
        case 'number':
          return isNumber(value)
        case 'string':
          return isString(value)
        case 'array':
          return isArray(value)
        case 'object':
          return isObject(value)
      }
    })

    return isAllowedType
      ? validOutput([], localContext)
      : invalidOutput(
          [],
          localContext.error`Type must be one of ${allowedTypes}, got ${getValueSimpleType(value)}`,
          localContext,
        )
  },

  // const
  const: (schema, value, context) => {
    if (isBoolean(schema) || schema.const === undefined) {
      return null
    }

    const localContext = enterKeyword('const', context)
    return equals(schema.const, value)
      ? validOutput([], localContext)
      : invalidOutput([], localContext.error`Must be equal to ${schema.const}`, localContext)
  },

  // enum
  enum: (schema, value, context) => {
    if (isBoolean(schema) || !isArray(schema.enum)) {
      return null
    }

    const localContext = enterKeyword('enum', context)
    return schema.enum.some(enumValue => equals(enumValue, value))
      ? validOutput([], localContext)
      : invalidOutput([], localContext.error`Must be equal to one of ${schema.enum}`, localContext)
  },

  // multipleOf
  multipleOf: (schema, value, context) => {
    if (isBoolean(schema) || !isNumber(schema.multipleOf) || !isNumber(value)) {
      return null
    }

    // TODO: Division by zero check?
    const localContext = enterKeyword('multipleOf', context)
    return isInteger(value / schema.multipleOf)
      ? validOutput([], localContext)
      : invalidOutput(
          [],
          localContext.error`Must be a multiple of ${schema.multipleOf}`,
          localContext,
        )
  },

  // maximum
  maximum: (schema, value, context) => {
    if (isBoolean(schema) || !isNumber(schema.maximum) || !isNumber(value)) {
      return null
    }

    const localContext = enterKeyword('maximum', context)
    return value > schema.maximum
      ? invalidOutput(
          [],
          localContext.error`Must be lower than or equal to ${schema.maximum}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // exclusiveMaximum
  exclusiveMaximum: (schema, value, context) => {
    if (isBoolean(schema) || !isNumber(schema.exclusiveMaximum) || !isNumber(value)) {
      return null
    }

    const localContext = enterKeyword('exclusiveMaximum', context)
    return value >= schema.exclusiveMaximum
      ? invalidOutput(
          [],
          localContext.error`Must be lower than ${schema.exclusiveMaximum}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // minimum
  minimum: (schema, value, context) => {
    if (isBoolean(schema) || !isNumber(schema.minimum) || !isNumber(value)) {
      return null
    }

    const localContext = enterKeyword('minimum', context)
    return value < schema.minimum
      ? invalidOutput(
          [],
          localContext.error`Must be higher than or equal to ${schema.minimum}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // exclusiveMinimum
  exclusiveMinimum: (schema, value, context) => {
    if (isBoolean(schema) || !isNumber(schema.exclusiveMinimum) || !isNumber(value)) {
      return null
    }

    const localContext = enterKeyword('exclusiveMinimum', context)
    return value <= schema.exclusiveMinimum
      ? invalidOutput(
          [],
          localContext.error`Must be higher than ${schema.exclusiveMinimum}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // maxLength
  maxLength: (schema, value, context) => {
    if (isBoolean(schema) || !isInteger(schema.maxLength) || !isString(value)) {
      return null
    }

    const localContext = enterKeyword('maxLength', context)
    return value.length > schema.maxLength
      ? invalidOutput(
          [],
          localContext.error`Must have a maximum length of ${schema.maxLength}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // minLength
  minLength: (schema, value, context) => {
    if (isBoolean(schema) || !isInteger(schema.minLength) || !isString(value)) {
      return null
    }

    const localContext = enterKeyword('minLength', context)
    return value.length < schema.minLength
      ? invalidOutput(
          [],
          localContext.error`Must have a minimum length of ${schema.minLength}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // pattern
  pattern: (schema, value, context) => {
    if (isBoolean(schema) || !isString(schema.pattern) || !isString(value)) {
      return null
    }

    const localContext = enterKeyword('pattern', context)
    return value.match(new RegExp(schema.pattern))
      ? validOutput([], localContext)
      : invalidOutput(
          [],
          localContext.error`Must match the pattern ${schema.pattern}`,
          localContext,
        )
  },

  // maxItems
  maxItems: (schema, value, context) => {
    if (isBoolean(schema) || !isInteger(schema.maxItems) || !isArray(value)) {
      return null
    }

    const localContext = enterKeyword('maxItems', context)
    return value.length > schema.maxItems
      ? invalidOutput(
          [],
          localContext.error`Must have a maximum item count of ${schema.maxItems}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // minItems
  minItems: (schema, value, context) => {
    if (isBoolean(schema) || !isInteger(schema.minItems) || !isArray(value)) {
      return null
    }

    const localContext = enterKeyword('minItems', context)
    return value.length < schema.minItems
      ? invalidOutput(
          [],
          localContext.error`Must have a minimum item count of ${schema.minItems}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // uniqueItems
  uniqueItems: (schema, value, context) => {
    if (isBoolean(schema) || !isBoolean(schema.uniqueItems) || !isArray(value)) {
      return null
    }

    const localContext = enterKeyword('uniqueItems', context)
    const itemOutputs = value.map((itemValue, index) => {
      const itemContext = enterInstance(index, localContext)
      const equalIndex = value.findIndex(compareValue => equals(compareValue, itemValue))
      return index === equalIndex
        ? validOutput([], itemContext)
        : invalidOutput(
            [],
            localContext.error`Must not be a duplicate of item at index ${equalIndex}`,
            itemContext,
          )
    })

    return combineOutputs(
      itemOutputs,
      localContext.error`Duplicate item validation failed`,
      localContext,
    )
  },

  // maxContains
  maxContains: (schema, value, context) => {
    if (
      isBoolean(schema) ||
      !isInteger(schema.maxContains) ||
      !isSchema(schema.contains) ||
      !isArray(value)
    ) {
      return null
    }

    const localContext = enterKeyword('maxContains', context)
    const itemSchema = schema.contains
    const maxContains = schema.maxContains
    const itemOutputs = value.map((itemValue, index) => {
      const itemContext = enterInstance(index, localContext)
      // TODO: Also yield verbose validation info for this?
      //       "contains" will already yield it, basically
      return validateFlag(itemSchema, itemValue, itemContext)
    })

    const matchingItemCount = itemOutputs.filter(({ valid }) => valid).length
    return matchingItemCount > maxContains
      ? invalidOutput(
          [],
          localContext.error`Must have at maximum ${schema.maxContains} items matching "contains"`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // minContains
  minContains: (schema, value, context) => {
    if (
      isBoolean(schema) ||
      !isInteger(schema.minContains) ||
      !isSchema(schema.contains) ||
      !isArray(value)
    ) {
      return null
    }

    const localContext = enterKeyword('minContains', context)
    const itemSchema = schema.contains
    const minContains = schema.minContains
    const itemOutputs = value.map((itemValue, index) => {
      const itemContext = enterInstance(index, localContext)
      // TODO: Also yield verbose validation info for this?
      //       "contains" will already yield it, basically
      return validateFlag(itemSchema, itemValue, itemContext)
    })

    const matchingItemCount = itemOutputs.filter(({ valid }) => valid).length
    return matchingItemCount < minContains
      ? invalidOutput(
          [],
          localContext.error`Must have at least ${schema.minContains} items matching "contains"`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // maxProperties
  maxProperties: (schema, value, context) => {
    if (isBoolean(schema) || !isInteger(schema.maxProperties) || !isObject(value)) {
      return null
    }

    const localContext = enterKeyword('maxProperties', context)
    const propertyCount = Object.keys(value).length

    return propertyCount > schema.maxProperties
      ? invalidOutput(
          [],
          localContext.error`Must have at maximum ${schema.maxProperties} properties`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // minProperties
  minProperties: (schema, value, context) => {
    if (isBoolean(schema) || !isInteger(schema.minProperties) || !isObject(value)) {
      return null
    }

    const localContext = enterKeyword('minProperties', context)
    const propertyCount = Object.keys(value).length

    return propertyCount < schema.minProperties
      ? invalidOutput(
          [],
          localContext.error`Must have at least ${schema.minProperties} properties`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // required
  required: (schema, value, context) => {
    if (isBoolean(schema) || !isArray(schema.required) || !isObject(value)) {
      return null
    }

    const localContext = enterKeyword('required', context)
    const missingProperties = schema.required.filter(key => !(key in value))

    return missingProperties.length > 0
      ? invalidOutput(
          [],
          localContext.error`Must contain the properties ${missingProperties}`,
          localContext,
        )
      : validOutput([], localContext)
  },

  // dependentRequired
  dependentRequired: (schema, value, context) => {
    if (isBoolean(schema) || !isObject(schema.dependentRequired) || !isObject(value)) {
      return null
    }

    const localContext = enterKeyword('dependentRequired', context)
    const keyOutputs = Object.entries(schema.dependentRequired).map(([key, required], index) => {
      const keyContext = enterKeyword(index, localContext)
      if (!(key in value)) {
        return validOutput([], keyContext)
      }
      const missingProperties = required.filter(childKey => !(childKey in value))
      return missingProperties.length > 0
        ? invalidOutput(
            [],
            keyContext.error`Must contain the properties ${missingProperties} because ${key} is defined`,
            keyContext,
          )
        : validOutput([], keyContext)
    })

    return combineOutputs(
      keyOutputs,
      localContext.error`Dependency validation failed`,
      localContext,
    )
  },
}

export default validationValidators
