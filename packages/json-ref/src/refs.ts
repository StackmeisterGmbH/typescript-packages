import type { Uri } from '@stackmeister/uri'
import { isArray, isObject } from '@stackmeister/types'
import { get } from '@stackmeister/json-pointer'
import { parse, stringify, resolve } from '@stackmeister/uri'
import clone from '@stackmeister/clone'

/**
 * An IRI string analogous to Uri.
 */
export type Iri = Uri

/**
 * An IRI Reference analogous to an URI reference.
 */
export type IriReference = Iri

/**
 * An anchor string.
 *
 * JSON-Schema defines it like this: ^[A-Za-z_][-A-Za-z0-9._]*$
 */
export type AnchorString = string

/**
 * Represents a reference to another value.
 *
 * A ref is only a valid ref if it doesn't have any other properties other than $ref.
 */
export type Ref<TargetIri extends IriReference = IriReference> = {
  readonly $ref: TargetIri
}

/**
 * Represents a root value that sets the base uri for all following refs.
 */
export type RefRoot<BaseIri extends IriReference = IriReference> = {
  readonly $id: BaseIri
}

/**
 * Represents an anchor inside values that can be referenced through refs.
 */
export type RefAnchor<Name extends AnchorString = AnchorString> = {
  readonly $anchor: Name
}

/**
 * Creates a new ref to another value.
 *
 * @param targetIri the URI where the other value is located
 * @returns the created reference.
 */
export const ref = <TargetIri extends IriReference>(targetIri: TargetIri): Ref<TargetIri> => ({
  $ref: targetIri,
})

/**
 * Checks if a value is a ref or not.
 *
 * @param value the value to check.
 * @returns true if the value is a ref, false if not.
 */
export const isRef = <Value>(value: Value): value is Value & Ref =>
  isObject(value) && '$ref' in value && typeof value.$ref === 'string'

/**
 * Checks if a value is a ref root.
 *
 * @param value the value to check.
 * @returns true if the value is a ref, false if not.
 */
export const isRefRoot = <Value>(value: Value): value is Value & RefRoot =>
  isObject(value) && '$id' in value && typeof value.$id === 'string'

/**
 * Checks if a value is a ref anchor.
 *
 * @param value the value to check.
 * @returns true if the value is a ref, false if not.
 */
export const isRefAnchor = <Value>(value: Value): value is Value & RefAnchor =>
  isObject(value) && '$anchor' in value && typeof value.$anchor === 'string'

/**
 * Resolves to a type that excludes any refs given in Value.
 */
export type ExcludeRefs<Value> = Value extends Ref
  ? unknown
  : Value extends Array<infer Item>
  ? ExcludeRefs<Item>[]
  : Value extends Record<string, unknown>
  ? { [Key in keyof Value]: ExcludeRefs<Value[Key]> }
  : Value

/**
 * A mutable object that will contain references during referencing.
 */
export type RefStore = Record<Iri, unknown>

/**
 * Options to pass to the dereferencing process.
 */
export type DerefOptions = {
  readonly baseIri: IriReference
  readonly fetch: (iri: Iri) => Promise<unknown>
  readonly store: RefStore
  readonly depth: number
}

/**
 * A context object that will be kept and modified during dereferencing.
 */
export type DerefContext<Value> = DerefOptions & {
  readonly root: Value
}

/**
 * Dereferences a ref to its respective referenced value.
 *
 * @param context the dereferencing context.
 * @param value the ref to dereference.
 * @returns the value that the reference referenced.
 */
const derefRef = async <Value, RootValue>(
  context: DerefContext<RootValue>,
  value: Ref,
): Promise<ExcludeRefs<Value>> => {
  const resolvedUri = resolve(context.baseIri, value.$ref)

  // Maybe the value was already dereferenced once completely, use the reference we've stored already
  if (resolvedUri in context.store) {
    return context.store[resolvedUri] as ExcludeRefs<Value>
  }

  const { fragment = '', ...uriParts } = parse(resolvedUri)

  const resolveFragment = (fragmentRoot: unknown, baseIri: string): ExcludeRefs<Value> => {
    if (fragment === '') {
      return fragmentRoot as ExcludeRefs<Value>
    }
    if (fragment.startsWith('/')) {
      return get<ExcludeRefs<Value>>(fragment, fragmentRoot)
    }
    throw new Error(`Could not resolve fragment ${fragment} in ${baseIri}`)
  }

  if (Object.keys(uriParts).length === 0) {
    // Seems like this URI has no other parts than a fragment
    // We load it from the root of the current value
    const resolvedValue = resolveFragment(context.root, context.baseIri)
    context.store[resolvedUri] = resolvedValue
    return resolvedValue
  }

  // Remove the fragment from the URI and let's fetch it from a remote resource
  const uriWithoutFragment = stringify(uriParts)

  // Maybe we fetched this remote resource already, lets check
  if (uriWithoutFragment in context.store) {
    // Yes we did, we resolve locally in the existing downloaded value
    const resolvedValue = resolveFragment(context.store[uriWithoutFragment], uriWithoutFragment)
    context.store[resolvedUri] = resolvedValue
    return resolvedValue
  }

  return context
    .fetch(uriWithoutFragment)
    .then(loadedValue => {
      // This is the point where we initially know about our referenced value.
      // The reference to this object needs to be consistent across a whole dereferencing context.
      // We store it as early as possible
      context.store[uriWithoutFragment] = loadedValue
      return loadedValue
    })
    .then(loadedValue => {
      // We force a baseURI change and also change the default root
      // to new newly loaded schema
      const newContext = { ...context, baseIri: uriWithoutFragment, root: loadedValue }
      scan(newContext, loadedValue)
      return derefValue(newContext, loadedValue)
    })
    .then(loadedValue => {
      const resolvedValue = resolveFragment(loadedValue, uriWithoutFragment)
      context.store[resolvedUri] = resolvedValue
      return resolvedValue
    })
}

/**
 * Dereferences any value recursively.
 *
 * @param context the context for dereferencing.
 * @param value the value to dereference.
 * @returns
 */
const derefValue = async <Value, RootValue>(
  context: DerefContext<RootValue>,
  value: Value,
): Promise<ExcludeRefs<Value>> => {
  if (isRef(value)) {
    const dereferencedValue = await derefRef(context, value)
    if (isObject(dereferencedValue) && Object.keys(value).length > 1) {
      // This object has custom properties that extend the ref
      // We create a new instance from it that won't be registered
      // as it is fully specific to this location
      return {
        ...Object.fromEntries(Object.entries(value).filter(([key]) => key !== '$ref')),
        ...dereferencedValue,
      } as ExcludeRefs<Value>
    }
    return dereferencedValue as ExcludeRefs<Value>
  }

  if (isArray(value) && context.depth > 0) {
    for (let index = 0; index < value.length; index++) {
      value[index] = await derefValue({ ...context, depth: context.depth - 1 }, value[index])
    }
    return value as ExcludeRefs<Value>
  }

  if (isObject(value) && context.depth > 0) {
    // If this object is a root/has an $id property, reconfigure the baseUri for all child
    // derefs
    const childContext: DerefContext<RootValue> = isRefRoot(value)
      ? { ...context, baseIri: resolve(context.baseIri, value.$id) }
      : context

    for (const [key, keyValue] of Object.entries(value)) {
      ;(value as Record<string, unknown>)[key] = await derefValue(
        { ...childContext, depth: childContext.depth - 1 },
        keyValue,
      )
    }

    return value as ExcludeRefs<Value>
  }

  return value as ExcludeRefs<Value>
}

/**
 * Scans a value for ref anchors and ref roots recursively.
 *
 * This is a process that will be made whenever a new value is introduced
 * to the dereferencing process. It will resolve all anchors and base URLs
 * and register them in the context as needed.
 *
 * @param context the context to scan with.
 * @param value the value to scan.
 */
const scan = <Value, RootValue>(context: DerefContext<RootValue>, value: Value): void => {
  if (isRefAnchor(value)) {
    const anchorUri = resolve(context.baseIri, `#${value.$anchor}`)
    context.store[anchorUri] = value
  }

  const root = isRefRoot(value)
  const childContext = root ? { ...context, baseIri: resolve(context.baseIri, value.$id) } : context

  if (root) {
    childContext.store[childContext.baseIri] = value
  }

  if (isArray(value)) {
    value.forEach(item => {
      scan(childContext, item)
    })
    return
  }

  if (isObject(value)) {
    Object.values(value).forEach(keyValue => {
      scan(childContext, keyValue)
    })
  }
}

/**
 * Loads and calls node-fetch.
 *
 * API is the same as fetch().
 */
const nodeFetch = (input: RequestInfo, init?: RequestInit): Promise<Response> =>
  import('node-fetch').then(
    ({ default: fetch }) =>
      fetch(
        // eslint-disable-next-line @typescript-eslint/consistent-type-imports
        input as unknown as import('node-fetch').RequestInfo,
        // eslint-disable-next-line @typescript-eslint/consistent-type-imports
        init as unknown as import('node-fetch').RequestInit,
      ) as unknown as Promise<Response>,
  )

/**
 * Defines fetch with a fallback to node-fetch if needed.
 */
const globalFetch = 'fetch' in globalThis ? globalThis.fetch : nodeFetch

/**
 * The default fetch function passed to the dereferencing process.
 *
 * @param iri the URI to load remotely.
 * @returns the JSON body of the resolved value.
 */
export const defaultFetch = (iri: Iri) => {
  return globalFetch(iri).then(response => response.json())
}

export const deref = <Value>(
  value: Value,
  options?: Partial<DerefOptions>,
): Promise<ExcludeRefs<Value>> => {
  const clonedValue = clone(value)
  const context: DerefContext<Value> = {
    baseIri: '',
    fetch: defaultFetch,
    store: {},
    root: clonedValue,
    depth: Infinity,
    ...options,
  }

  scan(context, clonedValue)
  return derefValue(context, clonedValue)
}
