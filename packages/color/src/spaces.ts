import type { Color } from './color'
import { colorConversions } from './conversions'

/**
 * The color spaces this library supports.
 */
export type ColorSpace = Color['space']
/* | 'hsv' | 'hsva' | 'cmyk' | 'xyz' | 'lab' */

/**
 * The unit of color values in color function expressions.
 */
export type ColorUnit = 'fixed' | 'percent'

/**
 * The interface for color space metadata
 *
 * @see colorSpaces
 */
export type ColorSpaceMetadata = {
  /**
   * The color channels of a color space.
   */
  readonly channels: ReadonlyArray<{
    /**
     * The scale we apply before and after calculations.
     *
     * This allows us to modify colors with human-readable, reasonable numeric values.
     *
     * <sample>
     *     Red in RGB is not stored as a number between 0-1, but 0-255. The scale is 255.
     * </sample>
     * <sample>
     *     Hue in HSL is not stored as a number between 0-1, but 0-360. The scale is 360.
     * </sample>
     */
    readonly scale: number

    /**
     * The type values of this channel get casted to.
     */
    readonly type: 'int' | 'float'

    /**
     * The unit a value is output in by this library.
     *
     * This is primarily used in color function expressions
     * (e.g. CSS expects saturation and lightness in hsl() expressions to be % values)
     */
    readonly unit: ColorUnit
  }>
}

/**
 * Metadata that is stored for each color space.
 *
 * It contains information about each specific color channel of the space.
 *
 * @see {ColorSpace}
 * @see {ColorSpaceMetadata}
 */
export const colorSpaces: Record<ColorSpace, ColorSpaceMetadata> = Object.freeze({
  rgb: Object.freeze({
    channels: Object.freeze([
      Object.freeze({ scale: 255, type: 'int', unit: 'fixed' }),
      Object.freeze({ scale: 255, type: 'int', unit: 'fixed' }),
      Object.freeze({ scale: 255, type: 'int', unit: 'fixed' }),
    ]),
  }),
  rgba: Object.freeze({
    channels: Object.freeze([
      Object.freeze({ scale: 255, type: 'int', unit: 'fixed' }),
      Object.freeze({ scale: 255, type: 'int', unit: 'fixed' }),
      Object.freeze({ scale: 255, type: 'int', unit: 'fixed' }),
      Object.freeze({ scale: 1, type: 'float', unit: 'fixed' }),
    ]),
  }),
  hsl: Object.freeze({
    channels: Object.freeze([
      Object.freeze({ scale: 360, type: 'float', unit: 'fixed' }),
      Object.freeze({ scale: 1, type: 'float', unit: 'percent' }),
      Object.freeze({ scale: 1, type: 'float', unit: 'percent' }),
    ]),
  }),
  hsla: Object.freeze({
    channels: Object.freeze([
      Object.freeze({ scale: 360, type: 'float', unit: 'fixed' }),
      Object.freeze({ scale: 1, type: 'float', unit: 'percent' }),
      Object.freeze({ scale: 1, type: 'float', unit: 'percent' }),
      Object.freeze({ scale: 1, type: 'float', unit: 'fixed' }),
    ]),
  }),
})

/**
 * Returns all metadata of the given color space.
 *
 * @param space A color space.
 */
export const getSpaceMetadata = (space: ColorSpace): ColorSpaceMetadata => {
  const metadata = colorSpaces[space]
  if (!metadata) {
    throw new Error(`Color space ${space} has no defined metadata`)
  }
  return metadata
}

/**
 * Returns the amount of color channels in a color space.
 *
 * @param space A color space.
 */
export const getSpaceChannelCount = (space: ColorSpace): number =>
  getSpaceMetadata(space).channels.length

/**
 * Returns the value scales of a color space as an array.
 *
 * @param space A color space.
 */
export const getSpaceScales = (space: ColorSpace): number[] =>
  getSpaceMetadata(space).channels.map(c => c.scale)

/**
 * Returns the value units of a color space as an array.
 *
 * @param space A color space.
 */
export const getSpaceUnits = (space: ColorSpace): ColorUnit[] =>
  getSpaceMetadata(space).channels.map(c => c.unit)

/**
 * Checks if a color is in the specified color space.
 *
 * @param {ColorSpace} space The color space you want to check for
 * @param {Color} color The color you want to check
 *
 * @returns {boolean}
 */
export const isSpace = (space: ColorSpace, color: Color): boolean => color.space === space

/**
 * Converts the color to the specified color space.
 *
 * @param targetSpace The color space you want to convert to.
 * @param color The color you want to convert.
 * @returns The converted color.
 */
export const toSpace = (targetSpace: ColorSpace, color: Color) =>
  color.space === targetSpace ? color : colorConversions[color.space][targetSpace](color)
