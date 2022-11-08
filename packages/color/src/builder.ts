import type { Color } from './color'
import type { ColorSpace } from './spaces'
import type { Scheme, SchemeGenerator, SchemeOptions } from './schemes'
import type { MixMode } from './mixers'
import { getOpacity, isAlpha, toAnyAlpha, toAnyOpaque, withOpacity, fadeIn, fadeOut } from './alpha'
import { toFunctionExpression, toHexExpression } from './expressions'
import {
  getHue,
  getSaturation,
  getLightness,
  isHsl,
  isHsla,
  isAnyHsl,
  toHsl,
  toHsla,
  withHue,
  withSaturation,
  withLightness,
  grayscale,
  complement,
  lighten,
  darken,
  tint,
  tone,
  toAnyHsl,
} from './hsl'
import { mix } from './mixers'
import {
  getBlue,
  getGreen,
  getRed,
  invert,
  isAnyRgb,
  isRgb,
  isRgba,
  toAnyRgb,
  toRgb,
  toRgba,
  withBlue,
  withGreen,
  withRed,
} from './rgb'
import {
  createComplementaryScheme,
  createAnalogousComplementaryScheme,
  createSplitComplementaryScheme,
  createTriadicComplementaryScheme,
  createSquareComplementaryScheme,
  createTetradicComplementaryScheme,
  createScheme,
  createLightShadeScheme,
  createDarkShadeScheme,
  createShadeScheme,
} from './schemes'
import { isSpace } from './spaces'
import toString from './toString'

export class ColorBuilder {
  constructor(public readonly color: Color) {}

  get red() {
    return getRed(this.color)
  }

  get green() {
    return getGreen(this.color)
  }

  get blue() {
    return getBlue(this.color)
  }

  get hue() {
    return getHue(this.color)
  }

  get saturation() {
    return getSaturation(this.color)
  }

  get lightness() {
    return getLightness(this.color)
  }

  get opacity() {
    return getOpacity(this.color)
  }

  get lightShades() {
    return this.createLightShades()
  }

  get darkShades() {
    return this.createDarkShades()
  }

  get shades() {
    return this.createShades()
  }

  get complements() {
    return createComplementaryScheme(this.color)
  }

  get analogousComplements() {
    return createAnalogousComplementaryScheme(this.color)
  }

  get splitComplements() {
    return createSplitComplementaryScheme(this.color)
  }

  get triadicComplements() {
    return createTriadicComplementaryScheme(this.color)
  }

  get squareComplements() {
    return createSquareComplementaryScheme(this.color)
  }

  get tetradicComplements() {
    return createTetradicComplementaryScheme(this.color)
  }

  public isSpace(space: ColorSpace) {
    return isSpace(space, this.color)
  }

  public isRgb() {
    return isRgb(this.color)
  }

  public isRgba() {
    return isRgba(this.color)
  }

  public isAnyRgb() {
    return isAnyRgb(this.color)
  }

  public isHsl() {
    return isHsl(this.color)
  }

  public isHsla() {
    return isHsla(this.color)
  }

  public isAnyHsl() {
    return isAnyHsl(this.color)
  }

  public isAlpha() {
    return isAlpha(this.color)
  }

  public toRgb() {
    return toRgb(this.color)
  }

  public toRgba() {
    return toRgba(this.color)
  }

  public toAnyRgb() {
    return toAnyRgb(this.color)
  }

  public toHsl() {
    return toHsl(this.color)
  }

  public toHsla() {
    return toHsla(this.color)
  }

  public toAnyHsl() {
    return toAnyHsl(this.color)
  }

  public toAnyAlpha() {
    return toAnyAlpha(this.color)
  }

  public toAnyOpaque() {
    return toAnyOpaque(this.color)
  }

  public withRed(value: number) {
    return new ColorBuilder(withRed(value, this.color))
  }

  public withGreen(value: number) {
    return new ColorBuilder(withGreen(value, this.color))
  }

  public withBlue(value: number) {
    return new ColorBuilder(withBlue(value, this.color))
  }

  public withHue(value: number) {
    return new ColorBuilder(withHue(value, this.color))
  }

  public withSaturation(value: number) {
    return new ColorBuilder(withSaturation(value, this.color))
  }

  public withLightness(value: number) {
    return new ColorBuilder(withLightness(value, this.color))
  }

  public withOpacity(value: number) {
    return new ColorBuilder(withOpacity(value, this.color))
  }

  public invert() {
    return new ColorBuilder(invert(this.color))
  }

  public grayscale() {
    return new ColorBuilder(grayscale(this.color))
  }

  public complement(value: number = 180) {
    return new ColorBuilder(complement(value, this.color))
  }

  public mix(mode: MixMode, color: Color) {
    return new ColorBuilder(mix(mode, color, this.color))
  }

  public mixRgbAdditive(color: Color) {
    return this.mix('rgbAdditive', color)
  }

  public mixRgbSubtractive(color: Color) {
    return this.mix('rgbSubtractive', color)
  }

  public mixRgbAverage(color: Color) {
    return this.mix('rgbAverage', color)
  }

  public lighten(value: number) {
    return new ColorBuilder(lighten(value, this.color))
  }

  public darken(value: number) {
    return new ColorBuilder(darken(value, this.color))
  }

  public tint(value: number) {
    return new ColorBuilder(tint(value, this.color))
  }

  public tone(value: number) {
    return new ColorBuilder(tone(value, this.color))
  }

  public fadeIn(value: number) {
    return new ColorBuilder(fadeIn(value, this.color))
  }

  public fadeOut(value: number) {
    return new ColorBuilder(fadeOut(value, this.color))
  }

  public createScheme<ColorNames extends string>(
    keys: readonly [...ColorNames[]],
    generate: SchemeGenerator,
    options: SchemeOptions = {},
  ): Scheme<ColorNames> {
    return createScheme(keys, generate, options, this.color)
  }

  public createLightShades(options: SchemeOptions = {}) {
    return createLightShadeScheme(options, this.color)
  }

  public createDarkShades(options: SchemeOptions = {}) {
    return createDarkShadeScheme(options, this.color)
  }

  public createShades(options: SchemeOptions = {}) {
    return createShadeScheme(options, this.color)
  }

  public toFunctionExpression() {
    return toFunctionExpression(this.color)
  }

  public toHexExpression() {
    return toHexExpression(this.color)
  }

  public toString() {
    return toString(this.color)
  }
}
