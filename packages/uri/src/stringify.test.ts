import each from 'jest-each'
import stringify from './stringify'

describe('stringify', () => {
  each([
    [
      'correctly stringify a slash path',
      {
        scheme: 'https',
        host: 'example.com',
        path: '/',
      },
      'https://example.com/',
    ],
    [
      'correctly stringify an empty path',
      {
        scheme: 'https',
        host: 'example.com',
      },
      'https://example.com',
    ],
  ]).it('should %s', (_, uriComponents, expected) => {
    expect(stringify(uriComponents)).toEqual(expected)
  })
})
