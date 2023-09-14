import type { Inflector } from './common'
import { uncountables, irregulars, pluralRules } from './common'

const pluralize: Inflector = value => {
  const lowercasedWord = value.toLowerCase()

  if (uncountables.includes(lowercasedWord)) {
    return value
  }

  for (const [singular, plural] of irregulars) {
    if (!lowercasedWord.endsWith(singular)) {
      continue
    }

    return value.replace(new RegExp(`${singular}$`, 'i'), plural)
  }

  for (const [regex, replacement] of pluralRules) {
    if (!regex.test(value)) {
      continue
    }

    return value.replace(regex, replacement)
  }

  return value
}

export default pluralize
