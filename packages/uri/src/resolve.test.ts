import each from 'jest-each'
import resolve from './resolve'

describe('resolve', () => {
  each([
    ['', '/a/b/c', '/a/b/c'],
    ['https://example.com/test.json', 'sub/directory', 'https://example.com/sub/directory'],
    ['https://example.com/test.json', '/sub/directory', 'https://example.com/sub/directory'],
    ['https://example.com/test.json', './sub/directory', 'https://example.com/sub/directory'],
    [
      'https://example.com/test.json/',
      './sub/directory',
      'https://example.com/test.json/sub/directory',
    ],
    ['https://example.com/test', './sub/directory', 'https://example.com/sub/directory'],
    ['https://example.com/test/', './sub/directory', 'https://example.com/test/sub/directory'],
    ['https://example.com/test', '../sub/directory', 'https://example.com/sub/directory'],
    ['https://example.com/test/other', '../sub/directory', 'https://example.com/sub/directory'],
    ['https://example.com/test/other', '/../sub/directory', 'https://example.com/sub/directory'],
    [
      'https://example.com/test/other/',
      '../sub/directory',
      'https://example.com/test/sub/directory',
    ],
    ['https://example.com/test/other/', '/../sub/directory', 'https://example.com/sub/directory'],
    [
      'https://example.com/test/other/ignored',
      '/../sub/directory',
      'https://example.com/sub/directory',
    ],
    ['file:///test.json', 'sub/directory', 'file:///sub/directory'],
    ['file:///test.json', '/sub/directory', 'file:///sub/directory'],
    ['file:///test.json', './sub/directory', 'file:///sub/directory'],
    ['file:///test', './sub/directory', 'file:///sub/directory'],
    ['file:///test/', './sub/directory', 'file:///test/sub/directory'],
    ['file:///test', '../sub/directory', 'file:///sub/directory'],
  ]).it('should correctly resolve %s with %s', (uriString, relativeUriString, expected) => {
    const result = resolve(uriString, relativeUriString)
    expect(result).toEqual(expected)
  })
})
