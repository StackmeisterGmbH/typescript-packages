import type { Inflector } from './common'
import createInflector from './createInflector'

const dashize: Inflector = createInflector({ delimiter: '-' })

export default dashize
