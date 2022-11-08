import type { Color } from './color'
import type { ColorSpace } from './spaces'
import { toSpace } from './spaces'
import { hsl, hsla } from './hsl'
import { rgb, rgba } from './rgb'
import { getSpaceScales } from './spaces'

const { min, max } = Math

export type ColorConversion = (color: Color) => Color
export type ColorConversionMap = Record<ColorSpace, Record<ColorSpace, ColorConversion>>

const getRgbFromHue = (p: number, q: number, t: number) => {
  let nt = t
  // Normalize
  if (nt < 0) {
    nt += 1
  } else if (nt > 1) {
    nt -= 1
  }

  if (nt < 1 / 6) {
    return p + (q - p) * 6 * nt
  }

  if (nt < 1 / 2) {
    return q
  }

  if (nt < 2 / 3) {
    return p + (q - p) * (2 / 3 - nt) * 6
  }

  return p
}

export const colorConversions: ColorConversionMap = {
  // RGB
  rgb: {
    // RGB -> RGB
    rgb: ({ data: [r, g, b] }) => rgb(r, g, b),
    // RGB -> RGBA
    rgba: ({ data: [r, g, b] }) => rgba(r, g, b, 1),
    // RGB -> HSL
    hsl: ({ data: [r, g, b] }) => {
      const [rScale, gScale, bScale] = getSpaceScales('rgb')
      r /= rScale
      g /= gScale
      b /= bScale

      const maxValue = max(r, g, b)
      const minValue = min(r, g, b)
      let h = 0
      let s = 0
      const l = (maxValue + minValue) / 2

      if (maxValue !== minValue) {
        const d = maxValue - minValue
        s = l > 0.5 ? d / (2 - maxValue - minValue) : d / (maxValue + minValue)

        switch (maxValue) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }

        h /= 6
      }

      const [hScale, sScale, lScale] = getSpaceScales('hsl')
      return hsl(h * hScale, s * sScale, l * lScale)
    },
    // RGB -> HSLA
    hsla: color => {
      const [h, s, l] = toSpace('hsl', color).data
      return hsla(h, s, l, 1)
    },
  },
  // RGBA
  rgba: {
    // RGBA -> RGB
    rgb: ({ data: [r, g, b] }) => rgb(r, g, b),
    // RGBA -> RGBA
    rgba: ({ data: [r, g, b, a] }) => rgba(r, g, b, a ?? 1),
    // RGBA -> HSL
    hsl: color => toSpace('hsl', toSpace('rgb', color)),
    // RGBA -> HSLA
    hsla: color => {
      const [h, s, l] = toSpace('hsl', color).data
      return hsla(h, s, l, color.data[3] ?? 1)
    },
  },
  hsl: {
    // HSL -> RGB
    rgb: ({ data: [h, s, l] }) => {
      const [hScale, sScale, lScale] = getSpaceScales('hsl')
      let r = 0
      let g = 0
      let b = 0
      h /= hScale
      s /= sScale
      l /= lScale

      if (s === 0.0) {
        r = l
        g = l
        b = l
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q

        r = getRgbFromHue(p, q, h + 1 / 3)
        g = getRgbFromHue(p, q, h)
        b = getRgbFromHue(p, q, h - 1 / 3)
      }

      const [rScale, gScale, bScale] = getSpaceScales('rgb')
      return rgb(r * rScale, g * gScale, b * bScale)
    },
    // HSL -> RGBA
    rgba: color => {
      const [r, g, b] = toSpace('rgb', color).data
      return rgba(r, g, b, 1)
    },
    // HSL -> HSL
    hsl: ({ data: [h, s, l] }) => hsl(h, s, l),
    // HSL -> HSLA
    hsla: ({ data: [h, s, l] }) => hsla(h, s, l, 1),
  },
  // HSLA
  hsla: {
    // HSLA -> RGB
    rgb: color => toSpace('rgb', toSpace('hsl', color)),
    // HSLA -> RGBA
    rgba: color => {
      const [r, g, b] = toSpace('rgb', color).data
      return rgba(r, g, b, color.data[3] ?? 1)
    },
    // HSLA -> HSL
    hsl: ({ data: [h, s, l] }) => hsl(h, s, l),
    // HSLA -> HSLA
    hsla: ({ data: [h, s, l, a] }) => hsla(h, s, l, a ?? 1),
  },
}
