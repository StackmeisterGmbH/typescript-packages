import pascalize from './pascalize'

describe('pascalize', () => {
  it('converts an underscored, camelized, or dasherized string into a class/pascal-case one', () => {
    expect(pascalize('some_text')).toBe('SomeText')
    expect(pascalize('some-text')).toBe('SomeText')
    expect(pascalize('someText')).toBe('SomeText')
    expect(pascalize('SomeText')).toBe('SomeText')
    expect(pascalize('SomeWTFText')).toBe('SomeWtfText')
    expect(pascalize('IDProvider')).toBe('IdProvider')
    expect(pascalize('XMLHttpRequest')).toBe('XmlHttpRequest')
    expect(pascalize('Some%$#&^*Text')).toBe('SomeText')
  })
})
