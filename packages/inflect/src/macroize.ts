import type { Inflector } from './common'
import createInflector from './createInflector'

const macroize: Inflector = createInflector({ delimiter: '_', casing: 'upper' })

export default macroize
