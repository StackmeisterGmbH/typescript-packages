export type {
  Iri,
  IriReference,
  AnchorString,
  Ref,
  RefRoot,
  RefAnchor,
  ExcludeRefs,
  DerefContext,
  DerefOptions,
  RefStore,
} from './refs'
export { ref, isRef, isRefRoot, isRefAnchor, deref, defaultFetch } from './refs'
