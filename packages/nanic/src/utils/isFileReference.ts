import type { FileReference } from '../common.js'
import { isObject, isString } from '@stackmeister/types'

const isFileReference = (data: unknown): data is FileReference =>
  isObject(data) && isString(data.at)

export default isFileReference
