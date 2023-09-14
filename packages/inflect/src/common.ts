export type Casing =
  | 'ignore'
  | 'lower'
  | 'upper'
  | 'firstUpper'
  | 'firstWordLower'
  | 'firstWordUpper'

export type InflectionOptions = {
  casing?: Casing
  delimiter?: string
}

export const defaultInflectionOptions: Required<InflectionOptions> = {
  casing: 'ignore',
  delimiter: ' ',
}

export type Inflector = (value: string) => string

export const pluralRules: [RegExp, string][] = [
  [/^(quiz)$/i, '$1zes'],
  [/^(ox)$/i, '$1en'],
  [/([ml])ouse$/i, '$1ice'],
  [/(matr|vert|ind)(ix|ex)$/i, '$1ices'],
  [/(x|ch|ss|sh)$/i, '$1es'],
  [/([^aeiouy]|qu)ies$/i, '$1y'],
  [/([^aeiouy]|qu)y$/i, '$1ies'],
  [/(hive)$/i, '$1s'],
  [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
  [/(shea|lea|loa|thie)f$/, '$1ves'],
  [/sis$/i, 'ses'],
  [/([ti])um$/i, '$1a'],
  [/(buffal|tomat|potat|ech|her|vet)o$/i, '$1oes'],
  [/(bu)s$/i, '$1ses'],
  [/(alias|status)$/i, '$1es'],
  [/(octop|vir)us$/i, '$1i'],
  [/(ax|test)is$/i, '$1es'],
  [/(us)$/, '$1es'],
  [/([^s]+)$/, '$1s'],
]

export const singularRules: [RegExp, string][] = [
  [/^(quiz)zes$/i, '$1'],
  [/^(matr|append)ices$/i, '$1ix'],
  [/^(vert|ind)ices$/i, '$1ex'],
  [/^(ox)en$/i, '$1'],
  [/^(alias)es$/i, '$1'],
  [/^(octop|vir)i$/i, '$1us'],
  [/^(cris|ax|test)es$/i, '$1is'],
  [/^(shoe)s$/i, '$1'],
  [/^(o)es$/i, '$1'],
  [/^(bus)es$/i, '$1'],
  [/([ml])ice$/i, '$1ouse'],
  [/^(x|ch|ss|sh)es$/i, '$1'],
  [/^(m)ovies$/i, '$1ovie'],
  [/^(s)eries$/i, '$1eries'],
  [/([^aeiouy]|qu)ies$/i, '$1y'],
  [/([lr])ves$/i, '$1f'],
  [/^(tive)s$/i, '$1'],
  [/^(hive)s$/i, '$1'],
  [/^(li|wi|kni)ves$/i, '$1fe'],
  [/^(shea|loa|lea|thie)ves$/i, '$1f'],
  [/^(^analy)ses$/i, '$1sis'],
  [/^((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1$2sis'],
  [/([ti])a$/i, '$1um'],
  [/^(n)ews$/i, '$1ews'],
  [/^(h|bl)ouses$/i, '$1ouse'],
  [/^(corpse)s$/i, '$1'],
  [/^(us)es$/i, '$1'],
  [/s$/i, ''],
]

export const uncountables: string[] = [
  'sheep',
  'fish',
  'deer',
  'moose',
  'series',
  'species',
  'money',
  'rice',
  'information',
  'equipment',
  'bison',
  'cod',
  'offspring',
  'pike',
  'salmon',
  'shrimp',
  'swine',
  'trout',
  'aircraft',
  'hovercraft',
  'spacecraft',
  'sugar',
  'tuna',
  'you',
  'wood',
]

export const irregulars: [singular: string, plural: string][] = [
  ['person', 'people'],
  ['man', 'men'],
  ['child', 'children'],
  ['sex', 'sexes'],
  ['move', 'moves'],
  ['foot', 'feet'],
  ['goose', 'geese'],
  ['tooth', 'teeth'],
]
