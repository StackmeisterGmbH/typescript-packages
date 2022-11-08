import type {
  Ref,
  RefRoot,
  RefAnchor,
  IriReference,
  AnchorString,
  Iri,
} from '@stackmeister/json-ref'
import type { Schema } from './schema'

/**
 * @category JSON-Schema Utility
 */
export type Vocabulary = Record<string, boolean>

/**
 * @category JSON-Schema Property
 */
export type CoreProperties = Partial<Ref & RefRoot & RefAnchor> & {
  readonly $schema?: Iri
  /** @deprecated replaced by $dynamicRef */
  readonly $recursiveRef?: IriReference
  /** @deprecated replaced by $dynamicAnchor */
  readonly $recursiveAnchor?: boolean
  readonly $dynamicRef?: IriReference
  readonly $dynamicAnchor?: AnchorString
  readonly $vocabulary?: Vocabulary
  readonly $comment?: string
  /** @deprecated replaced by $defs */
  readonly definitions?: Record<string, Schema>
  readonly $defs?: Record<string, Schema>
}

/**
 * @category JSON-Schema Utility
 */
export const coreProperties: ReadonlyArray<keyof CoreProperties> = [
  '$id',
  '$schema',
  '$ref',
  '$anchor',
  '$recursiveRef',
  '$recursiveAnchor',
  '$dynamicRef',
  '$dynamicAnchor',
  '$vocabulary',
  '$comment',
  'definitions',
  '$defs',
] as const
