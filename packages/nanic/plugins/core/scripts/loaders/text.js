import { readFile } from 'node:fs/promises'
import debug from 'debug'

const log = debug('nanic:loaders:text')

export const load = async (url) => {
  log('load %s', url)
  const text = await readFile(url, 'utf8')
  return [{ content: text }]
}
