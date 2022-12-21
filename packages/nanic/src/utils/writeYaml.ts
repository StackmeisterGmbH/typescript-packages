import { writeFile } from 'node:fs/promises'
import { stringify } from 'yaml'
import debug from 'debug'

const log = debug('nanic:utils:writeYaml')

const writeYaml = async <Value>(url: URL, data: Value): Promise<void> => {
  log('Writing YAML [%s]', url)
  const yaml = stringify(data)
  await writeFile(url, yaml, 'utf-8')
}

export default writeYaml
