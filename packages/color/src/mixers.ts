import type { Color } from './color'
import { rgba, rgb, toAnyRgb } from './rgb'
import { getSpaceScales } from './spaces'

const { min } = Math

export type MixMode = 'rgbAdditive' | 'rgbSubtractive' | 'rgbAverage'

export const mixRgbAdditive = (color: Color, mixColor: Color) => {
  const [r, g, b, a = 1] = toAnyRgb(color).data
  const [mixR, mixG, mixB, mixA = 1] = toAnyRgb(mixColor).data
  const [rScale, gScale, bScale, aScale] = getSpaceScales('rgba')
  const mixedR = min(rScale, r + mixR)
  const mixedG = min(gScale, g + mixG)
  const mixedB = min(bScale, b + mixB)
  const mixedA = min(aScale, (a + mixA) / 2)
  return mixedA < 1 ? rgba(mixedR, mixedG, mixedB, mixedA) : rgb(mixedR, mixedG, mixedB)
}

export const mixRgbSubtractive = (color: Color, mixColor: Color) => {
  const [r, g, b, a = 1] = toAnyRgb(color).data
  const [mixR, mixG, mixB, mixA = 1] = toAnyRgb(mixColor).data
  const [rScale, gScale, bScale, aScale] = getSpaceScales('rgba')
  const mixedR = min(rScale, (r * mixR) / rScale)
  const mixedG = min(gScale, (g * mixG) / gScale)
  const mixedB = min(bScale, (b * mixB) / bScale)
  const mixedA = min(aScale, (a + mixA) / 2)
  return mixedA < 1 ? rgba(mixedR, mixedG, mixedB, mixedA) : rgb(mixedR, mixedG, mixedB)
}

export const mixRgbAverage = (color: Color, mixColor: Color) => {
  const [r, g, b, a = 1] = toAnyRgb(color).data
  const [mixR, mixG, mixB, mixA = 1] = toAnyRgb(mixColor).data
  const [rScale, gScale, bScale, aScale] = getSpaceScales('rgba')
  const mixedR = min(rScale, (r + mixR) / 2)
  const mixedG = min(gScale, (g + mixG) / 2)
  const mixedB = min(bScale, (b + mixB) / 2)
  const mixedA = min(aScale, (a + mixA) / 2)
  return mixedA < 1 ? rgba(mixedR, mixedG, mixedB, mixedA) : rgb(mixedR, mixedG, mixedB)
}

export const mix = (mode: MixMode, mixColor: Color, color: Color) => {
  switch (mode) {
    case 'rgbAdditive':
      return mixRgbAdditive(color, mixColor)
    case 'rgbSubtractive':
      return mixRgbSubtractive(color, mixColor)
    case 'rgbAverage':
      return mixRgbAverage(color, mixColor)
  }
  throw new Error(`Unknown mix mode ${mode} given`)
}
