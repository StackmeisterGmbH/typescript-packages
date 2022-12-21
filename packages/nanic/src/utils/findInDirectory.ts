import type { ResourceType } from '../common.js'
import glob from 'glob'
import { fileURLToPath } from 'node:url'
import debug from 'debug'

const log = debug('nanic:utils:findInDirectory')

const findInDirectory = async (
  directory: URL,
  resourceType: ResourceType,
  level = 0,
): Promise<string[]> => {
  const pattern = `*.${resourceType}`
  const cwd = fileURLToPath(directory)
  log(`%sFinding '%s' in [%s] using pattern '%s'`, ' '.repeat(level), resourceType, cwd, pattern)
  const foundFiles = await new Promise<string[]>((resolve, reject) =>
    glob(pattern, { cwd, matchBase: true, nodir: true, absolute: true }, (error, paths) => {
      if (error) {
        throw reject(error)
      }
      resolve(paths)
    }),
  )
  log(`${'-'.repeat(level)}Found %d files (%o)`, foundFiles.length, foundFiles)
  return foundFiles
}

export default findInDirectory
