import type { Inflector } from './common'
import createInflector from './createInflector'

const dotize: Inflector = createInflector({ delimiter: '.' })

export default dotize
