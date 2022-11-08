import type { Color } from './color'
import { isAlpha } from './alpha'
import { getSpaceScales, isSpace, toSpace } from './spaces'

export const rgb = (r: number, g: number, b: number): Color => ({
  space: 'rgb',
  data: [r, g, b],
})

export const rgba = (r: number, g: number, b: number, a: number): Color => ({
  space: 'rgba',
  data: [r, g, b, a],
})

export const isRgb = (color: Color): boolean => isSpace('rgb', color)

export const isRgba = (color: Color): boolean => isSpace('rgba', color)

export const isAnyRgb = (color: Color): boolean => isRgb(color) || isRgba(color)

export const toRgb = (color: Color): Color => toSpace('rgb', color)

export const toRgba = (color: Color): Color => toSpace('rgba', color)

export const toAnyRgb = (color: Color): Color => (isAlpha(color) ? toRgba(color) : toRgb(color))

export const getRed = (color: Color): number => toAnyRgb(color).data[0]

export const withRed = (value: number, color: Color): Color => {
  const [, g, b, a] = toAnyRgb(color).data
  return a !== undefined ? rgba(value, g, b, a) : rgb(value, g, b)
}

export const getGreen = (color: Color): number => toAnyRgb(color).data[1]

export const withGreen = (value: number, color: Color): Color => {
  const [r, , b, a] = toAnyRgb(color).data
  return a !== undefined ? rgba(r, value, b, a) : rgb(r, value, b)
}

export const getBlue = (color: Color): number => toAnyRgb(color).data[2]

export const withBlue = (value: number, color: Color): Color => {
  const [r, g, , a] = toAnyRgb(color).data
  return a !== undefined ? rgba(r, g, value, a) : rgb(r, g, value)
}

export const invert = (color: Color): Color => {
  const [r, g, b, a] = toAnyRgb(color).data
  const [rScale, gScale, bScale] = getSpaceScales('rgb')
  return a !== undefined
    ? rgba(rScale - r, gScale - g, bScale - b, a)
    : rgb(rScale - r, gScale - g, bScale - b)
}
