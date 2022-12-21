import type { ResourceType } from '../common.js'
import glob from 'glob'
import { fileURLToPath } from 'node:url'
import debug from 'debug'

const log = debug('nanic:utils:findInDirectory')

const findInDirectory = async (directory: URL, resourceType: ResourceType): Promise<string[]> => {
  const pattern = `*.${resourceType}`
  const cwd = fileURLToPath(directory)
  log(`Finding '%s' in [%s] using pattern '%s'`, resourceType, cwd, pattern)
  const foundFiles = await new Promise<string[]>((resolve, reject) =>
    glob(pattern, { cwd, matchBase: true, nodir: true, absolute: true }, (error, paths) => {
      if (error) {
        throw reject(error)
      }
      resolve(paths)
    }),
  )
  log(`Found %d files (%o)`, foundFiles.length, foundFiles)
  return foundFiles
}

export default findInDirectory
