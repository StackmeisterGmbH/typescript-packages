import type { Color } from './color'
import { lighten, complement } from './hsl'

export type SchemeOptions = {
  readonly start?: number
  readonly step?: number
}

export type SchemeGenerationOptions = {
  readonly length?: number
} & SchemeOptions

export type SchemeGenerator = (value: number, color: Color) => Color
export type Scheme<ColorName extends string> = Record<ColorName, Color>
export type LightShadeScheme = Scheme<'normal' | 'light' | 'lighter' | 'lightest'>
export type DarkShadeScheme = Scheme<'normal' | 'dark' | 'darker' | 'darkest'>
export type ShadeScheme = LightShadeScheme | DarkShadeScheme

// eslint-disable-next-line func-style
export function* generateScheme(
  color: Color,
  generate: SchemeGenerator,
  options?: SchemeGenerationOptions,
) {
  const { start, step, length } = { start: 0, step: 0.1, length: 5, ...options }
  for (let i = 0; i < length; i += 1) {
    yield generate(start + i * step, color)
  }
}

export const createScheme = <ColorNames extends string>(
  keys: readonly [...ColorNames[]],
  generate: SchemeGenerator,
  options: SchemeOptions,
  color: Color,
): Scheme<ColorNames> => {
  const genOptions = { ...options, length: keys.length }
  const result: any = {}
  let i = 0
  for (const genColor of generateScheme(color, generate, genOptions)) {
    result[keys[i]] = genColor
    i += 1
  }
  return Object.fromEntries(
    Array.from(generateScheme(color, generate, genOptions), (generatedColor, index) => [
      keys[index],
      generatedColor,
    ]),
  ) as Scheme<ColorNames>
}

export const createLightShadeScheme = (options: SchemeOptions, color: Color): LightShadeScheme =>
  createScheme(['normal', 'light', 'lighter', 'lightest'], lighten, options, color)

export const createDarkShadeScheme = (options: SchemeOptions, color: Color): DarkShadeScheme =>
  createScheme(['normal', 'dark', 'darker', 'darkest'], lighten, options, color)

export const createShadeScheme = (options: SchemeOptions, color: Color): ShadeScheme => ({
  ...createLightShadeScheme(options, color),
  ...createDarkShadeScheme(options, color),
})

export const createComplementaryScheme = (color: Color) =>
  createScheme(['primary', 'secondary'], complement, { step: 180 }, color)

export const createAnalogousComplementaryScheme = (color: Color) =>
  createScheme(['tertiary', 'primary', 'secondary'], complement, { start: -30, step: 30 }, color)

export const createSplitComplementaryScheme = (color: Color) =>
  createScheme(['tertiary', 'primary', 'secondary'], complement, { start: -150, step: 150 }, color)

export const createTriadicComplementaryScheme = (color: Color) =>
  createScheme(['tertiary', 'primary', 'secondary'], complement, { start: -120, step: 120 }, color)

export const createSquareComplementaryScheme = (color: Color) =>
  createScheme(['primary', 'secondary', 'tertiary', 'quartenary'], complement, { step: 90 }, color)

export const createTetradicComplementaryScheme = (
  color: Color,
): Scheme<'primary' | 'secondary' | 'tertiary' | 'quartenary'> => ({
  primary: color,
  secondary: complement(120, color),
  tertiary: complement(180, color),
  quartenary: complement(-60, color),
})
