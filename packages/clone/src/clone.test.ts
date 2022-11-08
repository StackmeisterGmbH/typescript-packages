import each from 'jest-each'
import clone from './clone'

const recursiveObject = {
  get recursiveRef() {
    return recursiveObject
  },
}

describe('clone', () => {
  each([
    ['simple object', { a: 1 }, { a: 1 }],
    ['simple array', [1, 2, 3], [1, 2, 3]],
    ['recursive object', recursiveObject, recursiveObject],
  ]).it('should correctly clone %s', (_, target, expected) => {
    const clonedValue = clone(target)
    expect(clonedValue).toEqual(expected)
    expect(clonedValue).not.toBe(target)
  })
})
