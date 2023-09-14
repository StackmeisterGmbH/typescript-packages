import dashify from './dashize'

describe('dashize', () => {
  it('converts an underscored, camelized, or dasherized string into a dashed/kebab-case one', () => {
    expect(dashify('some_text')).toBe('some-text')
    expect(dashify('some-text')).toBe('some-text')
    expect(dashify('someText')).toBe('some-Text')
    expect(dashify('SomeText')).toBe('Some-Text')
    expect(dashify('SomeWTFText')).toBe('Some-WTF-Text')
    expect(dashify('IDProvider')).toBe('ID-Provider')
    expect(dashify('XMLHttpRequest')).toBe('XML-Http-Request')
    expect(dashify('Some%$#&^*Text')).toBe('Some-Text')
  })
})
