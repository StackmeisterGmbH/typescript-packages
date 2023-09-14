import type { Inflector } from './common'
import createInflector from './createInflector'

const slashize: Inflector = createInflector({ delimiter: '/' })

export default slashize
