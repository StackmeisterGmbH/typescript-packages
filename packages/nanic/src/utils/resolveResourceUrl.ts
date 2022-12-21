import type { Stats } from 'node:fs'
import type { ResourceType, Path } from '../common.js'
import { stat } from 'node:fs/promises'
import { basename } from 'node:path'
import sanitizeDirectoryUrl from './sanitizeDirectoryUrl.js'

const resolveResourceUrl = async (
  baseUrl: URL,
  path: Path,
  resourceType: ResourceType,
): Promise<URL> => {
  const directoryUrl = sanitizeDirectoryUrl(baseUrl)
  const fullUrl = new URL(`${path}.${resourceType}`, directoryUrl)
  const pathBasename = basename(path)
  const dirFullUrl = new URL(`${path}/${pathBasename}.${resourceType}`, directoryUrl)
  let info: Stats | undefined = undefined
  try {
    info = await stat(fullUrl)
    if (info.isFile()) {
      return fullUrl
    }
  } catch (error) {
    // ignore
  }

  if (!info || info.isDirectory()) {
    try {
      const newInfo = await stat(dirFullUrl)
      if (newInfo.isFile()) {
        return dirFullUrl
      }
    } catch (error) {
      // ignore
    }
  }

  throw new Error(
    `File ${path}.${resourceType} not found in ${baseUrl}, tried ${fullUrl} and ${dirFullUrl}.`,
  )
}

export default resolveResourceUrl
