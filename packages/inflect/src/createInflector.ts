import type { InflectionOptions } from './common'
import { defaultInflectionOptions, type Inflector, type Casing } from './common'

const trimAndApplyCasing = (casing: Casing) => (word: string, index: number) => {
  const trimmedWord = word.trim()
  switch (casing) {
    case 'lower':
      return trimmedWord.toLowerCase()
    case 'upper':
      return trimmedWord.toUpperCase()
    case 'firstUpper':
      return trimmedWord === ''
        ? ''
        : trimmedWord[0].toUpperCase() + trimmedWord.slice(1).toLowerCase()
    case 'firstWordLower':
      if (index === 0) {
        return trimmedWord.toLowerCase()
      }
      return trimmedWord === ''
        ? ''
        : trimmedWord[0].toUpperCase() + trimmedWord.slice(1).toLowerCase()
    case 'firstWordUpper':
      if (index === 0) {
        return trimmedWord === ''
          ? ''
          : trimmedWord[0].toUpperCase() + trimmedWord.slice(1).toLowerCase()
      }
      return trimmedWord.toLowerCase()
  }
  return trimmedWord
}

const createInflector =
  (options: InflectionOptions): Inflector =>
  value =>
    value
      .replace(/[^A-Za-z0-9]+/g, ' ')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      .replace(/[-_\s]+/g, ' ')
      .split(' ')
      .map(trimAndApplyCasing(options.casing ?? defaultInflectionOptions.casing))
      .join(options.delimiter ?? defaultInflectionOptions.delimiter)

export default createInflector
