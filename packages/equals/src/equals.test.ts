import each from 'jest-each'
import equals from './equals'

describe('equals', () => {
  each([
    ['null - null', null, null, true],
    ['null - undefined', null, undefined, false],
    ['undefined - null', undefined, null, false],
    ['empty array - false', [], false, false],
    ['0 - false', 0, false, false],
    ['"" - false', '', false, false],
    ['obj - inequal obj', { a: 1 }, { a: 2 }, false],
    ['deep obj - equal deep obj', { a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 1, d: 2 } } }, true],
    [
      'deep obj - inequal deep obj',
      { a: { b: { c: 1, d: 2 } } },
      { a: { b: { c: 2, d: 2 } } },
      false,
    ],
    ['array - equal array', [1, 2, 3, 4], [1, 2, 3, 4], true],
    ['array - inequal array', [1, 2, 3, 4], [1, 2, 4, 4], false],
  ]).it('should correctly check equality for %s', (_, left, right, expected) => {
    const result = equals(left, right)
    expect(result).toBe(expected)
  })
})
