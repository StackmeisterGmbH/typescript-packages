import { isArray } from '@stackmeister/types'
import { readFile } from 'node:fs/promises'
import { parseAllDocuments } from 'yaml'
import debug from 'debug'

const log = debug('nanic:utils:readYaml')

const readYaml = async <Document>(url: URL): Promise<Document[]> => {
  log('Reading YAML [%s]', url)
  const yaml = await readFile(url, 'utf-8')
  const documents = parseAllDocuments(yaml)
  if (isArray(documents)) {
    return documents.map(doc => doc.toJSON())
  }
  return []
}

export default readYaml
