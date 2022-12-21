import type { DirectoryReference } from '../common.js'
import { isObject, isString } from '@stackmeister/types'

const isDirectoryReference = (data: unknown): data is DirectoryReference =>
  isObject(data) && isString(data.in)

export default isDirectoryReference
