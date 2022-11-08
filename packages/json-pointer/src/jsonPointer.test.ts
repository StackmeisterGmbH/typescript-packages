import each from 'jest-each'
import { get, remove, set } from './jsonPointer'

describe('get', () => {
  each([
    ['', { test: 1 }, { test: 1 }],
    ['/test', { test: 1 }, 1],
    ['/test', { test: undefined }, undefined],
    ['/test/2', { test: [1, 2, undefined, 4] }, undefined],
    ['/test', { test: { a: 1 } }, { a: 1 }],
    ['/test/a', { test: { a: 1 } }, 1],
    ['/test/2', { test: [1, 2, 3, 4] }, 3],
    ['/te~1st/2', { 'te/st': [1, 2, 3, 4] }, 3],
    ['/te~0st/2', { 'te~st': [1, 2, 3, 4] }, 3],
    ['/te~0~1st/2', { 'te~/st': [1, 2, 3, 4] }, 3],
  ]).it('should correctly resolve the pointer %s', (pointer, value, expected) => {
    const result = get(pointer, value)
    expect(result).toEqual(expected)
  })
})

describe('set', () => {
  each([
    ['', { test: 1 }, 4, 4],
    ['/test', { test: 1 }, 2, { test: 2 }],
    ['/test/2', { test: [1, 2, undefined, 4] }, 3, { test: [1, 2, 3, 4] }],
    ['/test', { test: { a: 1 } }, { a: 2 }, { test: { a: 2 } }],
    ['/undeclared', { test: 1 }, 'test', { test: 1, undeclared: 'test' }],
    ['/test/a', { test: { a: 1 } }, 2, { test: { a: 2 } }],
    ['/test/2', { test: [1, 2, 3, 4] }, 4, { test: [1, 2, 4, 4] }],
    ['/test/-', { test: [1, 2, 3, 4] }, 4, { test: [1, 2, 3, 4, 4] }],
    ['/te~1st/2', { 'te/st': [1, 2, 3, 4] }, 4, { 'te/st': [1, 2, 4, 4] }],
    ['/te~0st/2', { 'te~st': [1, 2, 3, 4] }, 4, { 'te~st': [1, 2, 4, 4] }],
    ['/te~0~1st/2', { 'te~/st': [1, 2, 3, 4] }, 4, { 'te~/st': [1, 2, 4, 4] }],
  ]).it('should correctly set the pointer %s', (pointer, target, value, expected) => {
    const result = set(pointer, target, value)
    expect(result).toEqual(expected)
  })

  each([
    ['/a/b/c/d', { a: {} }, 2, { a: { b: { c: { d: 2 } } } }],
    ['/test/-/test', { test: [1, 2, 3, 4] }, 4, { test: [1, 2, 3, 4, { test: 4 }] }],
  ]).it('should correctly set the pointer %s deeply', (pointer, target, value, expected) => {
    const result = set(pointer, target, value, { deep: true })
    expect(result).toEqual(expected)
  })
})

describe('remove', () => {
  each([
    ['', { test: 1 }, undefined],
    ['/test', { test: 1 }, {}],
    ['/test/2', { test: [1, 2, 3, 4] }, { test: [1, 2, 4] }],
    ['/test', { test: { a: 1 } }, {}],
    ['/test/a', { test: { a: 1 } }, { test: {} }],
    ['/te~1st/2', { 'te/st': [1, 2, 3, 4] }, { 'te/st': [1, 2, 4] }],
    ['/test/1/a', { test: [1, { a: 2 }, 3, 4] }, { test: [1, {}, 3, 4] }],
    ['/te~0st/2', { 'te~st': [1, 2, 3, 4] }, { 'te~st': [1, 2, 4] }],
    ['/te~0~1st/2', { 'te~/st': [1, 2, 3, 4] }, { 'te~/st': [1, 2, 4] }],
  ]).it('should correctly remove the pointer %s', (pointer, target, expected) => {
    const result = remove(pointer, target)
    expect(result).toEqual(expected)
  })
})
