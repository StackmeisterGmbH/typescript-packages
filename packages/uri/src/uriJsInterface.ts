import { SCHEMES } from 'uri-js'

const id = <Value>(value: Value): Value => value
const createIdSchemeHandler = (scheme: string) => ({ scheme, parse: id, serialize: id })
const overwrittenSchemes = ['mailto', 'urn', 'urn-uuid', 'ws', 'wss', 'http', 'https']
const schemeHandlers = Object.fromEntries(
  overwrittenSchemes.map(scheme => [scheme, createIdSchemeHandler(scheme)]),
)
const originalSchemeHandlers = Object.fromEntries(
  overwrittenSchemes.map(scheme => [scheme, SCHEMES[scheme]]),
)

/**
 * Configures the global schema handlers of uri-js to fit stackmeister conventions.
 */
export const configureUriJs = (): void => {
  Object.assign(SCHEMES, schemeHandlers)
}

/**
 * Restores the normal uri-js global schema handlers in order to not interfere with other libraries.
 */
export const restoreUriJs = (): void => {
  Object.assign(SCHEMES, originalSchemeHandlers)
}
