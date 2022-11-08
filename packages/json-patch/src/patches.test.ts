import each from 'jest-each'
import {
  applyOperation,
  applyPatch,
  createPatch,
  replace,
  remove,
  add,
  move,
  copy,
  test,
} from './patches'

describe('applyOperation', () => {
  each([
    ['object property replace', { a: 1 }, replace('/a', 2), { a: 2 }],
    ['array index replace', [1, 2, 3], replace('/1', 4), [1, 4, 3]],
    ['object property removal', { a: 1, b: 2 }, remove('/b'), { a: 1 }],
    ['array index removal', [1, 2, 3], remove('/1'), [1, 3]],
  ]).it('should apply a %s operation properly', (_, value, operation, expected) => {
    expect(applyOperation(value, operation)).toEqual(expected)
  })
})

describe('applyPatch', () => {
  each([
    [
      'all operations in a single',
      { a: 1, b: 2 },
      [
        add('/c', 10),
        replace('/b', 5),
        remove('/a'),
        move('/b', '/d'),
        copy('/d', '/e'),
        test('/e', 5),
      ],
      { c: 10, d: 5, e: 5 },
    ],
  ]).it('should apply a %s patch properly', (_, value, patch, expected) => {
    expect(applyPatch(value, patch)).toEqual(expected)
  })
})

describe('createPatch', () => {
  each([
    [
      'object property mutation',
      { a: 1 },
      (value: any) => (value.a = 10),
      [replace('/a', 10)],
      { a: 10 },
    ],
    [
      'deep object property mutation',
      { a: 1, b: { deep: 5 } },
      (value: any) => (value.b.deep = 10),
      [replace('/b/deep', 10)],
      { a: 1, b: { deep: 10 } },
    ],
    [
      'object property addition',
      { a: 1 },
      (value: any) => (value.b = 10),
      [add('/b', 10)],
      { a: 1, b: 10 },
    ],
    [
      'deep object property addition',
      { a: 1, b: { c: 2 } },
      (value: any) => (value.b.deep = 10),
      [add('/b/deep', 10)],
      { a: 1, b: { c: 2, deep: 10 } },
    ],
    ['property removal', { a: 1, b: 2 }, (value: any) => delete value.b, [remove('/b')], { a: 1 }],
    [
      'deep property removal',
      { a: 1, b: { deep: 2 } },
      (value: any) => delete value.b.deep,
      [remove('/b/deep')],
      { a: 1, b: {} },
    ],
    [
      'array index mutation',
      [1, 2, 3],
      (value: any) => (value[1] = 10),
      [replace('/1', 10)],
      [1, 10, 3],
    ],
    [
      'deep array index mutation',
      { a: { deep: [1, 2, 3] } },
      (value: any) => (value.a.deep[1] = 10),
      [replace('/a/deep/1', 10)],
      { a: { deep: [1, 10, 3] } },
    ],
    ['array push', [1, 2, 3], (value: any) => value.push(4), [add('/-', 4)], [1, 2, 3, 4]],
    [
      'deep array push',
      { a: { deep: ['test', [1, 2, 3]] } },
      (value: any) => value.a.deep[1].push(10),
      [add('/a/deep/1/-', 10)],
      { a: { deep: ['test', [1, 2, 3, 10]] } },
    ],
    [
      'array splice',
      [1, 2, 3, 4],
      (value: any) => value.splice(1, 2, 'test', 14, true),
      [replace('', [1, 'test', 14, true, 4])],
      [1, 'test', 14, true, 4],
    ],
  ]).it('should create a %s patch properly', (_, value, mutate, expected, expectedApplied) => {
    const patch = createPatch(value, mutate)
    expect(patch).toEqual(expected)
    expect(applyPatch(value, patch)).toEqual(expectedApplied)
  })
})
