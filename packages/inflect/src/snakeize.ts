import type { Inflector } from './common'
import createInflector from './createInflector'

const snakeize: Inflector = createInflector({ delimiter: '_', casing: 'lower' })

export default snakeize
