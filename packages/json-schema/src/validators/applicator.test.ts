import { validateFlag, validateVerbose } from '../validation'
import each from 'jest-each'

describe('applicatorValidators', () => {
  describe('prefixItems', () => {
    it('should produce correct verbose output for valid state', () => {
      const result = validateVerbose(
        { $id: 'https://example.com', prefixItems: [{ type: 'number' }] },
        [2],
      )

      expect(result).toEqual({
        absoluteKeywordLocation: 'https://example.com#',
        valid: true,
        keywordLocation: '',
        instanceLocation: '',
        annotations: [
          {
            absoluteKeywordLocation: 'https://example.com#/prefixItems',
            valid: true,
            keywordLocation: '/prefixItems',
            instanceLocation: '',
            annotations: [
              {
                absoluteKeywordLocation: 'https://example.com#/prefixItems/0',
                valid: true,
                keywordLocation: '/prefixItems/0',
                instanceLocation: '/0',
                annotations: [
                  {
                    absoluteKeywordLocation: 'https://example.com#/prefixItems/0/type',
                    valid: true,
                    keywordLocation: '/prefixItems/0/type',
                    instanceLocation: '/0',
                  },
                ],
              },
            ],
          },
        ],
      })
    })

    it('should produce correct verbose output for invalid state', () => {
      const result = validateVerbose(
        { $id: 'https://example.com', prefixItems: [{ type: 'number' }] },
        ['test'],
      )
      expect(result).toEqual({
        absoluteKeywordLocation: 'https://example.com#',
        valid: false,
        keywordLocation: '',
        instanceLocation: '',
        errors: [
          {
            absoluteKeywordLocation: 'https://example.com#/prefixItems',
            valid: false,
            keywordLocation: '/prefixItems',
            instanceLocation: '',
            errors: [
              {
                absoluteKeywordLocation: 'https://example.com#/prefixItems/0',
                valid: false,
                keywordLocation: '/prefixItems/0',
                instanceLocation: '/0',
                errors: [
                  {
                    absoluteKeywordLocation: 'https://example.com#/prefixItems/0/type',
                    valid: false,
                    keywordLocation: '/prefixItems/0/type',
                    instanceLocation: '/0',
                    error: 'Type must be one of ["number"], got "string"',
                  },
                ],
                error: 'Validation failed',
              },
            ],
            error: 'Prefix child validation failed at indexes [0]',
          },
        ],
        error: 'Validation failed',
      })
    })

    it('should invalidate with a single invalid item in between valid items', () => {
      const result = validateVerbose(
        { prefixItems: [{ type: 'string' }, { type: 'number' }, { type: 'string' }] },
        ['test 1', 'test 2', 'test 3'],
      )
      expect(result).toEqual({
        absoluteKeywordLocation: '#',
        valid: false,
        keywordLocation: '',
        instanceLocation: '',
        errors: [
          {
            absoluteKeywordLocation: '#/prefixItems',
            valid: false,
            keywordLocation: '/prefixItems',
            instanceLocation: '',
            annotations: [
              {
                absoluteKeywordLocation: '#/prefixItems/0',
                valid: true,
                keywordLocation: '/prefixItems/0',
                instanceLocation: '/0',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/prefixItems/0/type',
                    valid: true,
                    keywordLocation: '/prefixItems/0/type',
                    instanceLocation: '/0',
                  },
                ],
              },
              {
                absoluteKeywordLocation: '#/prefixItems/2',
                valid: true,
                keywordLocation: '/prefixItems/2',
                instanceLocation: '/2',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/prefixItems/2/type',
                    valid: true,
                    keywordLocation: '/prefixItems/2/type',
                    instanceLocation: '/2',
                  },
                ],
              },
            ],
            errors: [
              {
                absoluteKeywordLocation: '#/prefixItems/1',
                valid: false,
                keywordLocation: '/prefixItems/1',
                instanceLocation: '/1',
                errors: [
                  {
                    absoluteKeywordLocation: '#/prefixItems/1/type',
                    valid: false,
                    keywordLocation: '/prefixItems/1/type',
                    instanceLocation: '/1',
                    error: 'Type must be one of ["number"], got "string"',
                  },
                ],
                error: 'Validation failed',
              },
            ],
            error: 'Prefix child validation failed at indexes [1]',
          },
        ],
        error: 'Validation failed',
      })
    })

    it('should ignore values out of bounds', () => {
      const result = validateFlag(
        { prefixItems: [{ type: 'string' }, { type: 'number' }, { type: 'string' }] },
        ['test 1'],
      )
      expect(result).toEqual({ valid: true })
    })

    it('should ignore values not defined', () => {
      const result = validateFlag({ prefixItems: [{ type: 'string' }] }, [
        'test 1',
        12,
        null,
        [],
        {},
      ])
      expect(result).toEqual({ valid: true })
    })
  })

  describe('items', () => {
    it('should produce correct verbose output for invalid state', () => {
      const result = validateVerbose(
        { items: { type: ['string', 'number'], minLength: 3, maximum: 10 } },
        [3, 'abc', 'ab', 12, 'a', null, 5],
      )
      expect(result).toEqual({
        absoluteKeywordLocation: '#',
        valid: false,
        keywordLocation: '',
        instanceLocation: '',
        errors: [
          {
            absoluteKeywordLocation: '#/items',
            valid: false,
            keywordLocation: '/items',
            instanceLocation: '',
            annotations: [
              {
                absoluteKeywordLocation: '#/items',
                valid: true,
                keywordLocation: '/items',
                instanceLocation: '/0',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/items/type',
                    valid: true,
                    keywordLocation: '/items/type',
                    instanceLocation: '/0',
                  },
                  {
                    absoluteKeywordLocation: '#/items/maximum',
                    valid: true,
                    keywordLocation: '/items/maximum',
                    instanceLocation: '/0',
                  },
                ],
              },
              {
                absoluteKeywordLocation: '#/items',
                valid: true,
                keywordLocation: '/items',
                instanceLocation: '/1',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/items/type',
                    valid: true,
                    keywordLocation: '/items/type',
                    instanceLocation: '/1',
                  },
                  {
                    absoluteKeywordLocation: '#/items/minLength',
                    valid: true,
                    keywordLocation: '/items/minLength',
                    instanceLocation: '/1',
                  },
                ],
              },
              {
                absoluteKeywordLocation: '#/items',
                valid: true,
                keywordLocation: '/items',
                instanceLocation: '/6',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/items/type',
                    valid: true,
                    keywordLocation: '/items/type',
                    instanceLocation: '/6',
                  },
                  {
                    absoluteKeywordLocation: '#/items/maximum',
                    valid: true,
                    keywordLocation: '/items/maximum',
                    instanceLocation: '/6',
                  },
                ],
              },
            ],
            errors: [
              {
                absoluteKeywordLocation: '#/items',
                valid: false,
                keywordLocation: '/items',
                instanceLocation: '/2',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/items/type',
                    valid: true,
                    keywordLocation: '/items/type',
                    instanceLocation: '/2',
                  },
                ],
                errors: [
                  {
                    absoluteKeywordLocation: '#/items/minLength',
                    valid: false,
                    keywordLocation: '/items/minLength',
                    instanceLocation: '/2',
                    error: 'Must have a minimum length of 3',
                  },
                ],
                error: 'Validation failed',
              },
              {
                absoluteKeywordLocation: '#/items',
                valid: false,
                keywordLocation: '/items',
                instanceLocation: '/3',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/items/type',
                    valid: true,
                    keywordLocation: '/items/type',
                    instanceLocation: '/3',
                  },
                ],
                errors: [
                  {
                    absoluteKeywordLocation: '#/items/maximum',
                    valid: false,
                    keywordLocation: '/items/maximum',
                    instanceLocation: '/3',
                    error: 'Must be lower than or equal to 10',
                  },
                ],
                error: 'Validation failed',
              },
              {
                absoluteKeywordLocation: '#/items',
                valid: false,
                keywordLocation: '/items',
                instanceLocation: '/4',
                annotations: [
                  {
                    absoluteKeywordLocation: '#/items/type',
                    valid: true,
                    keywordLocation: '/items/type',
                    instanceLocation: '/4',
                  },
                ],
                errors: [
                  {
                    absoluteKeywordLocation: '#/items/minLength',
                    valid: false,
                    keywordLocation: '/items/minLength',
                    instanceLocation: '/4',
                    error: 'Must have a minimum length of 3',
                  },
                ],
                error: 'Validation failed',
              },
              {
                absoluteKeywordLocation: '#/items',
                valid: false,
                keywordLocation: '/items',
                instanceLocation: '/5',
                errors: [
                  {
                    absoluteKeywordLocation: '#/items/type',
                    valid: false,
                    keywordLocation: '/items/type',
                    instanceLocation: '/5',
                    error: 'Type must be one of ["string","number"], got "null"',
                  },
                ],
                error: 'Validation failed',
              },
            ],
            error: 'Child validation failed at indexes [2,3,4,5]',
          },
        ],
        error: 'Validation failed',
      })
    })
  })

  describe('additionalProperties', () => {
    each([
      [
        'normal usage - valid',
        { additionalProperties: { type: 'string' } },
        { a: '1', b: '2', c: '3' },
        { valid: true },
      ],
      [
        'normal usage - invalid',
        { additionalProperties: { type: 'string' } },
        { a: '1', b: 2, c: '3' },
        { valid: false },
      ],
      [
        'with properties - valid',
        { properties: { a: { type: 'number' } }, additionalProperties: { type: 'string' } },
        { a: 1, b: '2', c: '3' },
        { valid: true },
      ],
      [
        'with properties - invalid',
        { properties: { a: { type: 'number' } }, additionalProperties: { type: 'string' } },
        { a: 1, b: 2, c: '3' },
        { valid: false },
      ],
      [
        'with pattern properties - valid',
        {
          patternProperties: { '^pat': { type: 'number' } },
          additionalProperties: { type: 'string' },
        },
        { patA: 1, b: '2', patC: 3, c: '3' },
        { valid: true },
      ],
      [
        'with pattern properties - invalid',
        {
          patternProperties: { '^pat': { type: 'number' } },
          additionalProperties: { type: 'string' },
        },
        { patA: 1, b: '2', padC: 3, c: '3' },
        { valid: false },
      ],
    ]).it('should correctly handle random schemas using it (%s)', (_, schema, value, expected) => {
      const result = validateFlag(schema, value)
      expect(result).toEqual(expected)
    })
  })
})
