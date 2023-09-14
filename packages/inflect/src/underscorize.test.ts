import underscorize from './underscorize'

describe('underscorize', () => {
  it('converts an underscored, camelized, or dasherized string into a underscored/snake_case one', () => {
    expect(underscorize('some_text')).toBe('some_text')
    expect(underscorize('some-text')).toBe('some_text')
    expect(underscorize('someText')).toBe('some_Text')
    expect(underscorize('SomeText')).toBe('Some_Text')
    expect(underscorize('SomeWTFText')).toBe('Some_WTF_Text')
    expect(underscorize('IDProvider')).toBe('ID_Provider')
    expect(underscorize('XMLHttpRequest')).toBe('XML_Http_Request')
    expect(underscorize('Some%$#&^*Text')).toBe('Some_Text')
  })
})
