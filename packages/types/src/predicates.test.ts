import { isObject } from './predicates'

describe('isObject', () => {
  it('should return false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('should return false for empty arrays', () => {
    expect(isObject([])).toBe(false)
  })

  it('should return false for arrays', () => {
    expect(isObject([1, 2, 3])).toBe(false)
  })

  it('should return true for empty objects', () => {
    expect(isObject({})).toBe(true)
  })

  it('should return true for objects', () => {
    expect(isObject({ a: 1, b: 2 })).toBe(true)
  })
})
