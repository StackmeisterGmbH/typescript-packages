import type { Schema } from './schema'

/**
 * @category JSON-Schema Property
 */
export type ContentProperties = {
  readonly contentEncoding?: string
  readonly contentMediaType?: string
  readonly contentSchema?: Schema
}

/**
 * @category JSON-Schema Utility
 */
export const contentProperties = ['contentEncoding', 'contentMediaType', 'contentSchema'] as const
