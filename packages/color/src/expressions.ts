import type { ColorSpace, ColorUnit } from './spaces'
import type { Color } from './color'
import { getSpaceMetadata } from './spaces'
import { rgb, toRgb } from './rgb'

const { round } = Math

const functionPattern = /(\w+)\(([^\)]+)\)/
const argUnitPattern = /([\d.]+)([\w%]+)?/

export const parseFunctionExpression = (value: string): Color => {
  const matches = value.match(functionPattern)
  if (!matches) {
    throw new Error('Passed string is not a valid color function expression')
  }
  const [, space, argString] = matches
  const metadata = getSpaceMetadata(space as ColorSpace)
  const argStrings = argString.split(',').map(s => s.trim())
  if (metadata.channels.length !== argStrings.length) {
    throw new Error(
      `Invalid number of arguments given to ${space}(), ` +
        `expected ${metadata.channels.length}, got ${argStrings.length}`,
    )
  }
  return {
    space: space as ColorSpace,
    data: metadata.channels.map(({ type, scale }, i) =>
      parseFunctionArg(argStrings[i], type, scale),
    ),
  } as Color
}

export const toFunctionExpression = (info: Color): string => {
  const metadata = getSpaceMetadata(info.space)
  const args = metadata.channels.map(({ type, scale, unit }, i) =>
    toFunctionArg(info.data[i], type, scale, unit),
  )
  return `${info.space}(${args.join(',')})`
}

export const parseHexExpression = (value: string): Color => {
  if ((value.length !== 4 && value.length !== 7) || !value.startsWith('#')) {
    throw new Error('A hex color expression needs to start with a # and have 3 or 6 hex digits')
  }
  const digits = value.substring(1)
  const short = digits.length === 3
  const r = short ? digits[0] + digits[0] : digits[0] + digits[1]
  const g = short ? digits[1] + digits[1] : digits[2] + digits[3]
  const b = short ? digits[2] + digits[2] : digits[4] + digits[5]
  return rgb(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16))
}

export const toHexExpression = (color: Color): string => {
  const rgbColor = toRgb(color)
  let hex = rgbColor.data.reduce((s, v) => s + round(v).toString(16).padStart(2, '0'), '')
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
    hex = hex[0] + hex[2] + hex[4]
  }
  return `#${hex}`
}

export const parseFunctionArg = (
  valueString: string,
  type: 'int' | 'float',
  scale: number,
): number => {
  const matches = valueString.match(argUnitPattern)
  if (!matches) {
    throw new Error(`Invalid argument format for argument ${valueString}`)
  }
  const [, value, unit = 'fixed'] = matches
  let numericValue = parseFloat(value)
  if (unit === 'percent') {
    numericValue = (numericValue / 100) * scale
  }
  if (type === 'int') {
    numericValue = round(numericValue)
  }
  return numericValue
}

export const trimZeroes = (numeric: string) => {
  if (!numeric.includes('.')) {
    return numeric
  }
  return numeric.replace(/\.?0+$/, '')
}

export const toFunctionArg = (
  value: number,
  type: 'int' | 'float',
  scale: number,
  unit: ColorUnit,
): string => {
  if (unit === 'percent') {
    return `${trimZeroes(((value / scale) * 100).toFixed(3))}%`
  }
  return type === 'int' ? round(value).toFixed(0) : trimZeroes(value.toFixed(3))
}
