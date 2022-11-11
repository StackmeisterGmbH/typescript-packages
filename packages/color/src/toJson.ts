import type { Color } from './color'
import toString from './toString'

const toJson = (color: Color): string => toString(color)

export default toJson
