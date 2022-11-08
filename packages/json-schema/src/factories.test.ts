import { nonNullable, nullable } from './factories'
import each from 'jest-each'

describe('nullable', () => {
  it('should make a schema nullable', () => {
    expect(nullable({ type: 'string' })).toEqual({ oneOf: [{ type: 'string' }, { type: 'null' }] })
  })
})

describe('nonNullable', () => {
  each([
    [1, { type: 'string' }, { type: 'string' }],
    [2, { type: ['null', 'string'] }, { type: 'string' }],
    [3, { type: ['string', 'null'] }, { type: 'string' }],
    [4, { type: ['null'] }, {}],
    [5, { oneOf: [{ type: 'null' }, { type: 'string' }] }, { type: 'string' }],
    [6, { oneOf: [{ type: 'string' }, { type: 'null' }] }, { type: 'string' }],
    [7, { oneOf: [{ type: 'string' }] }, { oneOf: [{ type: 'string' }] }],
    [
      8,
      { oneOf: [{ type: 'string' }, { type: 'null' }, { type: 'number' }] },
      { oneOf: [{ type: 'string' }, { type: 'number' }] },
    ],
    [9, { oneOf: [{ type: 'null' }] }, {}],
  ]).it('should make a schema nullable %d', (_index, nullable, expected) => {
    expect(nonNullable(nullable)).toEqual(expected)
  })
})
