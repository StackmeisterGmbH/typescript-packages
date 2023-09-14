import type { Inflector } from './common'
import createInflector from './createInflector'

const titleize: Inflector = createInflector({ casing: 'firstUpper', delimiter: ' ' })

export default titleize
