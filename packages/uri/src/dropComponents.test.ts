import each from 'jest-each'
import dropComponents from './dropComponents'

describe('dropComponents', () => {
  each([
    ['https://example.com', ['fragment'], 'https://example.com'],
    ['https://example.com#test', ['fragment'], 'https://example.com'],
    ['https://example.com/#test', ['fragment'], 'https://example.com/'],
    ['https://example.com/', ['fragment'], 'https://example.com/'],
  ]).it('should correctly drop from %s', (uriString, components, expected) => {
    const result = dropComponents(components, uriString)
    expect(result).toEqual(expected)
  })
})
