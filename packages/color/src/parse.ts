import { ColorBuilder } from './builder'
import colors from './colors'
import { parseFunctionExpression, parseHexExpression } from './expressions'

const parse = (value: string): ColorBuilder => {
  if (value in colors) {
    return colors[value as keyof typeof colors]
  }

  const color = value.startsWith('#') ? parseHexExpression(value) : parseFunctionExpression(value)
  return new ColorBuilder(color)
}

export default parse
