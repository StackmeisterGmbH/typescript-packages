import { validateFlag, validateVerbose } from '../validation'
import each from 'jest-each'

describe('validationValidators', () => {
  describe('type', () => {
    each([
      ['null - valid', { type: 'null' }, [null], { valid: true }],
      [
        'null - invalid',
        { type: 'null' },
        [undefined, true, false, 0, 123, 123.123, 'abc', [], {}],
        { valid: false },
      ],
      ['boolean - valid', { type: 'boolean' }, [true, false], { valid: true }],
      [
        'boolean - invalid',
        { type: 'boolean' },
        [undefined, null, 0, 123, 123.123, 'abc', [], {}],
        { valid: false },
      ],
      ['number - valid', { type: 'number' }, [0, 123, 123.123], { valid: true }],
      [
        'number - invalid',
        { type: 'number' },
        [undefined, null, true, false, 'abc', [], {}],
        { valid: false },
      ],
      ['integer - valid', { type: 'integer' }, [0, 123], { valid: true }],
      [
        'integer - invalid',
        { type: 'integer' },
        [undefined, null, true, false, 123.123, 'abc', [], {}],
        { valid: false },
      ],
      ['string - valid', { type: 'string' }, ['test'], { valid: true }],
      [
        'string - invalid',
        { type: 'string' },
        [undefined, null, true, false, 0, 123, 123.123, [], {}],
        { valid: false },
      ],
      ['array - valid', { type: 'array' }, [[], [1, 2, 3]], { valid: true }],
      [
        'array - invalid',
        { type: 'array' },
        [undefined, null, true, false, 0, 123, 123.123, 'abc', {}],
        { valid: false },
      ],
      ['object - valid', { type: 'object' }, [{}, { a: 1, b: 2, c: 3 }], { valid: true }],
      [
        'object - invalid',
        { type: 'object' },
        [undefined, null, true, false, 0, 123, 123.123, 'abc', []],
        { valid: false },
      ],
    ]).it('should detect simple types correctly (%s)', (_, schema, values, expected) => {
      values.forEach((value: unknown) => expect(validateFlag(schema, value)).toEqual(expected))
    })
  })

  describe('uniqueItems', () => {
    it('should output correct verbose information', () => {
      const result = validateVerbose(
        {
          uniqueItems: true,
        },
        [1, 2, 1, 3],
      )
      expect(result).toEqual({
        absoluteKeywordLocation: '#',
        valid: false,
        keywordLocation: '',
        instanceLocation: '',
        errors: [
          {
            absoluteKeywordLocation: '#/uniqueItems',
            valid: false,
            keywordLocation: '/uniqueItems',
            instanceLocation: '',
            annotations: [
              {
                absoluteKeywordLocation: '#/uniqueItems',
                valid: true,
                keywordLocation: '/uniqueItems',
                instanceLocation: '/0',
              },
              {
                absoluteKeywordLocation: '#/uniqueItems',
                valid: true,
                keywordLocation: '/uniqueItems',
                instanceLocation: '/1',
              },
              {
                absoluteKeywordLocation: '#/uniqueItems',
                valid: true,
                keywordLocation: '/uniqueItems',
                instanceLocation: '/3',
              },
            ],
            errors: [
              {
                absoluteKeywordLocation: '#/uniqueItems',
                valid: false,
                keywordLocation: '/uniqueItems',
                instanceLocation: '/2',
                error: 'Must not be a duplicate of item at index 0',
              },
            ],
            error: 'Duplicate item validation failed',
          },
        ],
        error: 'Validation failed',
      })
    })

    each([
      [
        'valid',
        { uniqueItems: true },
        [
          undefined,
          true,
          false,
          0,
          123,
          123.123,
          'abc',
          [],
          [1, 2, 3],
          [{ a: 1 }, { a: 2 }, { b: 1 }, {}],
        ],
        { valid: true },
      ],
      [
        'invalid',
        { uniqueItems: true },
        [
          [1, 1],
          [0, 1, 2, 3, 4, 2, 5, 6],
          [{ a: 1 }, { b: 2 }, { a: 2 }, { a: 1 }, { d: 2 }],
        ],
        { valid: false },
      ],
    ]).it('should validate uniqueness of items (%s)', (_, schema, values, expected) => {
      values.forEach((value: unknown) => expect(validateFlag(schema, value)).toEqual(expected))
    })
  })
})
