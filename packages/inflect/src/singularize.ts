import type { Inflector } from './common'
import { uncountables, irregulars, singularRules } from './common'

const singularize: Inflector = value => {
  const lowercasedWord = value.toLowerCase()

  if (uncountables.includes(lowercasedWord)) {
    return value
  }

  for (const [singular, plural] of irregulars) {
    if (!lowercasedWord.endsWith(plural)) {
      continue
    }

    return value.replace(new RegExp(`${plural}$`, 'i'), singular)
  }

  for (const [regex, replacement] of singularRules) {
    if (!regex.test(value)) {
      continue
    }

    return value.replace(regex, replacement)
  }

  return value
}

export default singularize
