import each from 'jest-each'
import { generateValue } from './values'

describe('generateValue', () => {
  each([
    ['null', { type: 'null' }, null],
    ['boolean', { type: 'boolean' }, false],
    ['number', { type: 'number' }, 0],
    ['integer', { type: 'integer' }, 0],
    ['string', { type: 'string' }, ''],
    ['object', { type: 'object' }, {}],
    ['object - by properties', { type: 'object' }, {}],
    ['array', { type: 'array' }, []],
    ['array - with default', { type: 'array', default: ['A', 'B', 'C'] }, ['A', 'B', 'C']],
    ['array - by items', { items: { default: 'Test' }, minItems: 3 }, ['Test', 'Test', 'Test']],
    [
      'array - by prefixItems',
      { prefixItems: [{ const: 'A' }, { default: 'B' }, { enum: ['C', 'D', 'E'] }] },
      ['A', 'B', 'C'],
    ],
  ]).it('should create a valid value (%s)', (_, schema, expectedValue) => {
    expect(generateValue(schema)).toEqual(expectedValue)
  })
})
