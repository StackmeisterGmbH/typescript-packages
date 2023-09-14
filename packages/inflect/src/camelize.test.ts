import camelize from './camelize'

describe('camelize', () => {
  it('converts an underscored, camelized, or dasherized string into a camelcase one', () => {
    expect(camelize('some_text')).toBe('someText')
    expect(camelize('some-text')).toBe('someText')
    expect(camelize('someText')).toBe('someText')
    expect(camelize('SomeText')).toBe('someText')
    expect(camelize('SomeWTFText')).toBe('someWtfText')
    expect(camelize('IDProvider')).toBe('idProvider')
    expect(camelize('XMLHttpRequest')).toBe('xmlHttpRequest')
    expect(camelize('Some%$#&^*Text')).toBe('someText')
  })
})
