import { readFile } from 'node:fs/promises'
import { parseAllDocuments } from 'yaml'
import { isArray } from '@stackmeister/types'
import debug from 'debug'

const log = debug('nanic:loaders:yaml')

export const load = async (url) => {
  log('load %s', url)
  const yaml = await readFile(url, 'utf8')
  const documents = parseAllDocuments(yaml)
  if (isArray(documents)) {
    return documents.map(doc => doc.toJSON())
  }
  return []
}
