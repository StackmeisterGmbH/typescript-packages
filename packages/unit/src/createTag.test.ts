import cssSystem from './systems/cssSystem'
import lengthSystem from './systems/lengthSystem'
import createTag from './createTag'

const css = createTag(cssSystem)
const len = createTag(lengthSystem)

describe('createTag', () => {
  it(`should correctly translate values with different translators`, () => {
    expect(css`4rem`.with({ rootFontSize: 16 }).px.toString()).toBe('64px')
    expect(css`4rem`.with({ rootFontSize: 16 }).px.toString()).toBe('64px')
    expect(css`-4rem`.with({ rootFontSize: 16 }).px.toString()).toBe('-64px')
    expect(css`0.5rem`.with({ rootFontSize: 16 }).px.toString()).toBe('8px')
    expect(css`0.5rem`.with({ rootFontSize: 30 }).px.toString()).toBe('15px')
    expect(css`4em`.with({ rootFontSize: 10, fontSize: 18 }).px.toString()).toBe('72px')
    expect(css`50%`.with({ width: 100 }).px.toString()).toBe('50px')
    expect(css`50vw`.with({ viewWidth: 1920 }).px.toString()).toBe('960px')
    expect(css`60vw`.with({ viewHeight: 1920 }).px.rem.toString()).toBe('64rem')
  })

  it('should corrected translate a value and back', () => {
    expect(css`32px`.with({ rootFontSize: 16 }).rem.px.rem.px.rem.toString()).toBe('2rem')
  })

  it('should correctly handle the default unit when parsing', () => {
    expect(css`32`.with({ rootFontSize: 16 }).rem.toString()).toBe('2rem')
  })

  it('should correctly handle missing zero prefix', () => {
    expect(css`.5`.px.toString()).toBe('0.5px')
    expect(css`.5px`.px.toString()).toBe('0.5px')
  })

  it('should be able to convert between units that dont have an explicit conversion', () => {
    expect(css`50%`.with({ width: 100, viewWidth: 200 }).vw.toString()).toBe('25vw')
    expect(css`2em`.with({ rootFontSize: 16, fontSize: 32 }).rem.toString()).toBe('4rem')
  })

  it('should be able to convert between different systems', () => {
    expect(css`50%`.with({ width: 37.795276 }).toSystem(lengthSystem, 'cm').km.toString()).toBe(
      '0.000005km',
    )

    expect(len`10m`.toSystem(cssSystem, 'cm').px.toString()).toBe('37795.276px')
    expect(len`12km`.toSystem(cssSystem, 'cm').with({ pixelRatio: 2 }).px.toString()).toBe(
      '90708662.4px',
    )
  })
})
