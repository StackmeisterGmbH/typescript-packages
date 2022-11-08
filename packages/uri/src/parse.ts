import type { Uri, UriComponents } from './common'
import { isNullOrUndefined, toInteger } from '@stackmeister/types'
import { parse as parseUri } from 'uri-js'
import { configureUriJs, restoreUriJs } from './uriJsInterface'

/**
 * Parses a URI into its components.
 *
 * If a component is not contained in the URI string, it will
 * be left out fully from the resulting object to keep resulting
 * objects as small as possible.
 *
 * @param uri the URI string to parse.
 * @returns the parsed URI components.
 */
const parse = (uri: Uri): UriComponents => {
  // We overwrite some scheme parsing behavior in url-js (we don't want it, actually. Let this function be as predicatable as possible.)
  configureUriJs()
  const { scheme, userinfo: userInfo, host, port, path, query, fragment, error } = parseUri(uri)
  // Assign the old behavior to url-js to not interfer with other instances using url-js directly
  restoreUriJs()

  if (error) {
    throw new Error(error)
  }

  const entries = [
    ['scheme', scheme],
    ['userInfo', userInfo],
    ['host', host || undefined],
    ['port', port !== undefined ? toInteger(port) : undefined],
    ['path', path || undefined],
    ['query', query],
    ['fragment', fragment],
  ]

  return Object.fromEntries(entries.filter(([, value]) => !isNullOrUndefined(value)))
}

export default parse
