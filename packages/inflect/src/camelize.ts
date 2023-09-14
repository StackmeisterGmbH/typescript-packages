import type { Inflector } from './common'
import createInflector from './createInflector'

const camelize: Inflector = createInflector({ delimiter: '', casing: 'firstWordLower' })

export default camelize
