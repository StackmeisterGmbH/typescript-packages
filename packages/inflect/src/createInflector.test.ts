import createInflector from './createInflector'

describe('inflect', () => {
  it('inflects any string into a specific form', () => {
    expect(createInflector({})('some_text')).toBe('some text')
    expect(createInflector({ casing: 'firstUpper' })('some-text')).toBe('Some Text')
    expect(createInflector({ casing: 'firstWordLower' })('some-text')).toBe('some Text')
    expect(createInflector({ casing: 'firstWordUpper' })('some-text')).toBe('Some text')
    expect(createInflector({})('some-text')).toBe('some text')
    expect(createInflector({})('someText')).toBe('some Text')
    expect(createInflector({})('SomeText')).toBe('Some Text')
    expect(createInflector({})('SomeWTFText')).toBe('Some WTF Text')
    expect(createInflector({})('IDProvider')).toBe('ID Provider')
    expect(createInflector({})('XMLHttpRequest')).toBe('XML Http Request')
    expect(createInflector({})('Some%$#&^*Text')).toBe('Some Text')
  })
})
