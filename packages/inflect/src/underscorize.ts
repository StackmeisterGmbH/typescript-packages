import type { Inflector } from './common'
import createInflector from './createInflector'

const underscorize: Inflector = createInflector({ delimiter: '_' })

export default underscorize
