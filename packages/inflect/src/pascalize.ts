import type { Inflector } from './common'
import createInflector from './createInflector'

const pascalize: Inflector = createInflector({ casing: 'firstUpper', delimiter: '' })

export default pascalize
