import type { JsonPointer } from '@stackmeister/json-pointer'
import type { Uri } from '@stackmeister/uri'

/**
 * @category JSON-Schema Output
 */
export type FlagOutput = {
  readonly valid: boolean
}

/**
 * @category JSON-Schema Output
 */
export type OutputUnit = {
  readonly keywordLocation: JsonPointer
  readonly absoluteKeywordLocation?: Uri
  readonly instanceLocation: JsonPointer
  readonly error?: string
  readonly errors?: ReadonlyArray<OutputUnit>
  readonly annotations?: ReadonlyArray<OutputUnit>
} & FlagOutput

/**
 * @category JSON-Schema Output
 */
export type BasicOutput = OutputUnit

/**
 * @category JSON-Schema Output
 */
export type DetailedOutput = OutputUnit

/**
 * @category JSON-Schema Output
 */
export type VerboseOutput = OutputUnit
