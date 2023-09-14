import type { Inflector } from './common'
import createInflector from './createInflector'

const kebabize: Inflector = createInflector({ delimiter: '-', casing: 'lower' })

export default kebabize
