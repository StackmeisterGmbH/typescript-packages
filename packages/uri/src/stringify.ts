import type { Uri, UriComponents } from './common'
import { serialize as serializeUri } from 'uri-js'
import { configureUriJs, restoreUriJs } from './uriJsInterface'

/**
 * Converts an object of URI components to its respective URI string.
 *
 * Properties not defined on the URI components object will be left out
 * fully from the resulting URI string.
 *
 * @param uriComponents the URI component object to stringify.
 * @returns the resulting URI string.
 */
const stringify = (uriComponents: UriComponents): Uri => {
  configureUriJs()
  const preparedComponents = Object.fromEntries(
    Object.entries({
      scheme: uriComponents.scheme ?? undefined,
      userinfo: uriComponents.userInfo ?? undefined,
      host: uriComponents.host ?? undefined,
      port: uriComponents.port ?? undefined,
      path: uriComponents.path ?? '',
      query: uriComponents.query ?? undefined,
      fragment: uriComponents.fragment ?? undefined,
    }),
  )
  const uri = serializeUri(preparedComponents)
  restoreUriJs()
  return uri
}

export default stringify
