import type { UriComponents } from './common'
import parse from './parse'
import stringify from './stringify'

/**
 * Removes one or more components from an URI string.
 *
 * @param componentKey an array of component keys to drop.
 * @returns the URI with the specified components removed.
 */
const dropComponents = (componentKeys: Array<keyof UriComponents>, uri: string): string => {
  const components = parse(uri)
  return stringify(
    Object.fromEntries(
      Object.entries(components).filter(
        ([key]) => !componentKeys.includes(key as keyof UriComponents),
      ),
    ),
  )
}

export default dropComponents
