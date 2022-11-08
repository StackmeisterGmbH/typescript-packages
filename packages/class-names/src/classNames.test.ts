import each from 'jest-each'
import classNames from './classNames'

describe('classNames', () => {
  each([
    ['a single string', ['a'], 'a'],
    ['multiple strings', ['a', 'b'], 'a b'],
    ['a string and an array of strings', ['a', ['b', 'c']], 'a b c'],
    ['a string with a falsy value', ['a', false, 'b'], 'a b'],
  ]).it('should correctly create a class name from %s', (_, args, expected) => {
    expect(classNames(...args)).toBe(expected)
  })
})
