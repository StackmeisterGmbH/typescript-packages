import type { Color } from './color'
import { isHsla, toHsla, toHsl, isAnyHsl } from './hsl'
import { isRgba, toRgba, toRgb } from './rgb'

/**
 * Checks if a color contains an alpha channel.
 *
 * @param color the color to check.
 * @returns true, if the color contains an alpha channel, false otherwise.
 */
export const isAlpha = (color: Color): boolean => isRgba(color) || isHsla(color)

/**
 * Converts the color to the next best color space containing an alpha channel.
 * Use this if you want to modify the alpha of your color as it saves conversion rountrips.
 *
 * @param color the color to convert.
 * @returns the color in the next best color space containing an alpha channel.
 */
export const toAnyAlpha = (color: Color): Color => (isAnyHsl(color) ? toHsla(color) : toRgba(color))

/**
 * Converts the color to the next best color space not containing an alpha channel.
 * Use this if you want to drop the alpha of your color as it saves conversion rountrips.
 *
 * @param color the color to convert.
 * @returns the color in the next best color space not containing an alpha channel.
 */
export const toAnyOpaque = (color: Color): Color => (isAnyHsl(color) ? toHsl(color) : toRgb(color))

/**
 * Retrieves the opacity of a color.
 *
 * The opacity comes in the scale 0.0-1.0.
 *
 * @param color the color to retrieve the opacity from.
 * @returns the opacity of the color.
 */
export const getOpacity = (color: Color): number => {
  const { data } = toAnyAlpha(color)
  return data[data.length - 1]
}

/**
 * Sets the opacity of a color.
 *
 * The opacity comes in the scale 0.0-1.0.
 *
 * @param value the opacity to set.
 * @param color the color to set the opacity of.
 * @returns the color with the specified opacity.
 */
export const withOpacity = (value: number, color: Color): Color => {
  const { space, data } = toAnyAlpha(color)
  return { space, data: [...data.slice(0, data.length - 1), value] } as Color
}

/**
 * Increases the opacity of a color.
 *
 * @param value the opacity to increase by.
 * @param color the color to increase the opacity of.
 * @returns the color with the increased opacity.
 */
export const fadeIn = (value: number, color: Color): Color =>
  withOpacity(getOpacity(color) + value, color)

/**
 * Decreases the opacity of a color.
 *
 * @param value the opacity to decrease by.
 * @param color the color to decrease the opacity of.
 * @returns the color with the decreased opacity.
 */
export const fadeOut = (value: number, color: Color): Color =>
  withOpacity(getOpacity(color) - value, color)
