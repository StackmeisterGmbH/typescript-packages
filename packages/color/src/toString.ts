import type { Color } from './color'
import { isAlpha, getOpacity } from './alpha'
import { toFunctionExpression, toHexExpression } from './expressions'
import { toAnyRgb } from './rgb'

const toString = (color: Color): string => {
  const rgbColor = toAnyRgb(color)
  return isAlpha(rgbColor) && getOpacity(rgbColor) < 1
    ? toFunctionExpression(rgbColor)
    : toHexExpression(rgbColor)
}

export default toString
