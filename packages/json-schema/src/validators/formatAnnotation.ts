import { isBoolean, isNumber, isString } from '@stackmeister/types'
import { enterKeyword } from '../contexts'
import { invalidOutput, validOutput } from '../outputs'
import type { Validator } from '../validation'

/**
 * @category Validator Format
 */
export type FormatValidator = (value: unknown) => boolean

/**
 * @category Validator Format
 */
export type FormatValidators = Record<string, FormatValidator>

/**
 * @category Validator Format
 */
export const standardFormatValidators: FormatValidators = {
  /*
   * String Formats
   */
  // TODO: Any sensible way to check this?
  regex: value => isString(value) && value.match(/.+/) !== null,
  'date-time': value =>
    isString(value) && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\d{2}:\d{2}$/) !== null,
  time: value => isString(value) && value.match(/^\d{2}:\d{2}:\d{2}$/) !== null,
  date: value => isString(value) && value.match(/^\d{4}-\d{2}-\d{2}$/) !== null,
  // TODO: Any sensible way to check this?
  email: value => isString(value) && value.includes('@'),
  // TODO: Any sensible way to check this?
  'idn-email': value => isString(value) && value.includes('@'),
  // TODO: Any sensible way to check this?
  hostname: value =>
    isString(value) &&
    value.match(
      /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/,
    ) !== null,
  // TODO: Any sensible way to check this?
  'idn-hostname': value => isString(value) && value.match(/.+/) !== null,
  // TODO: Any sensible way to check this?
  'iri-reference': value => isString(value) && value.match(/.+/) !== null,
  // TODO: Any sensible way to check this?
  iri: value => isString(value) && value.match(/.+/) !== null,
  // TODO: Any sensible way to check this?
  'uri-reference': value => isString(value) && value.match(/.+/) !== null,
  // TODO: Any sensible way to check this?
  uri: value => isString(value) && value.match(/.+/) !== null,
  // TODO: Any sensible way to check this?
  'json-pointer': value => isString(value) && value.match(/.+/) !== null,
  ipv4: value =>
    isString(value) &&
    value.match(
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ) !== null,
  ipv6: value =>
    isString(value) &&
    value.match(
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    ) !== null,

  /*
   * Number formats
   */
  u8: value => isNumber(value) && value >= 0 && value <= 255,
  u16: value => isNumber(value) && value >= 0 && value <= 65535,
  u32: value => isNumber(value) && value >= 0 && value <= 4294967295,
  u64: value => isNumber(value) && value >= 0,
  i8: value => isNumber(value) && value >= -128 && value <= 127,
  i16: value => isNumber(value) && value >= -32768 && value <= 32767,
  i32: value => isNumber(value) && value >= -2147483648 && value <= 2147483647,
  i64: isNumber,
  single: isNumber,
  double: isNumber,
}

/**
 * @category Validator Format
 */
export const formatAnnotationValidators: Record<string, Validator> = {
  format: (schema, value, context) => {
    if (isBoolean(schema) || !isString(schema.format) || !context.formatValidators[schema.format]) {
      return null
    }

    const localContext = enterKeyword('format', context)
    const valid = context.formatValidators[schema.format](value)
    return valid
      ? validOutput([], localContext)
      : invalidOutput([], localContext.error`Must be of format ${schema.format}`, localContext)
  },
}

export default formatAnnotationValidators
