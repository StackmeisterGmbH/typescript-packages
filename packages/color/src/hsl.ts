import type { Color } from './color'
import { isAlpha } from './alpha'
import rotateValue from './rotateValue'
import { getSpaceScales, isSpace, toSpace } from './spaces'

export const hsl = (h: number, s: number, l: number): Color => ({
  space: 'hsl',
  data: [h, s, l],
})

export const hsla = (h: number, s: number, l: number, a: number): Color => ({
  space: 'hsla',
  data: [h, s, l, a],
})

export const isHsl = (color: Color): boolean => isSpace('hsl', color)

export const isHsla = (color: Color): boolean => isSpace('hsla', color)

export const isAnyHsl = (color: Color): boolean => isHsl(color) || isHsla(color)

export const toHsl = (color: Color): Color => toSpace('hsl', color)

export const toHsla = (color: Color): Color => toSpace('hsla', color)

export const toAnyHsl = (color: Color): Color => (isAlpha(color) ? toHsla(color) : toHsl(color))

export const getHue = (color: Color): number => toAnyHsl(color).data[0]

export const withHue = (value: number, color: Color): Color => {
  const [, s, l, a] = toAnyHsl(color).data
  return a !== undefined ? hsla(value, s, l, a) : hsl(value, s, l)
}

export const getSaturation = (color: Color): number => toAnyHsl(color).data[1]

export const withSaturation = (value: number, color: Color): Color => {
  const [h, , l, a] = toAnyHsl(color).data
  return a !== undefined ? hsla(h, value, l, a) : hsl(h, value, l)
}

export const getLightness = (color: Color): number => toAnyHsl(color).data[2]

export const withLightness = (value: number, color: Color): Color => {
  const [h, s, , a] = toAnyHsl(color).data
  return a !== undefined ? hsla(h, s, value, a) : hsl(h, s, value)
}

export const lighten = (value: number, color: Color): Color =>
  withLightness(getLightness(color) + value, color)

export const darken = (value: number, color: Color): Color =>
  withLightness(getLightness(color) - value, color)

export const tint = (value: number, color: Color): Color =>
  withSaturation(getSaturation(color) + value, color)

export const tone = (value: number, color: Color): Color =>
  withSaturation(getSaturation(color) - value, color)

export const grayscale = (color: Color): Color => withSaturation(0, color)

export const complement = (value: number, color: Color): Color => {
  const hue = getHue(color)
  const [hScale] = getSpaceScales('hsl')
  return withHue(rotateValue(hue + value, hScale), color)
}
