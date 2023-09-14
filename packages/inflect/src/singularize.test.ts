import singularize from './singularize'

describe('singularize', () => {
  it('converts plural forms to singular', () => {
    const testCases: [string, string][] = [
      ['quizzes', 'quiz'],
      ['matrices', 'matrix'],
      ['vertices', 'vertex'],
      ['indices', 'index'],
      ['oxen', 'ox'],
      ['aliases', 'alias'],
      ['octopi', 'octopus'],
      ['crises', 'crisis'],
      ['axes', 'axis'],
      ['tests', 'test'],
      ['shoes', 'shoe'],
      ['mice', 'mouse'],
      ['geese', 'goose'],
      ['movies', 'movie'],
      ['series', 'series'],
      ['companies', 'company'],
      ['wives', 'wife'],
      ['knives', 'knife'],
      ['sheaves', 'sheaf'],
      ['analyses', 'analysis'],
      ['theses', 'thesis'],
      ['diagnoses', 'diagnosis'],
      ['parentheses', 'parenthesis'],
      ['prognoses', 'prognosis'],
      ['synopses', 'synopsis'],
      ['criteria', 'criterium'],
      ['news', 'news'],
      ['data', 'datum'],
      ['appendices', 'appendix'],
    ]

    for (const [input, expected] of testCases) {
      expect(singularize(input)).toBe(expected)
    }
  })
})
