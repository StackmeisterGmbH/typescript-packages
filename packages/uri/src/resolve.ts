import type { Uri } from './common'
import { resolve as resolveUri } from 'uri-js'
import { configureUriJs, restoreUriJs } from './uriJsInterface'

/**
 * Resolves an URI against a base URI.
 *
 * This function properly combines two URIs given
 * a base URI and a relative URI that gets resolved on it.
 *
 * An absolute URI passed as the relative URI will always
 * overwrite the base URI fully.
 *
 * @param baseUri the base URI to resolve against.
 * @param uri the relative URI to resolve.
 * @returns the resolved URI string.
 */
const resolve = (baseUri: Uri, uri: Uri): string => {
  if (baseUri === '') {
    return uri
  }
  configureUriJs()
  const result = resolveUri(baseUri, uri)
  restoreUriJs()
  return result
}

export default resolve
