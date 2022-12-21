import type { LoadOptions } from '../common.js'
import debug from 'debug'
import resolveResourceUrl from '../utils/resolveResourceUrl.js'
import readYaml from '../utils/readYaml.js'
import loadDocument from './loadDocument.js'

const log = debug('nanic:loaders:loadResourceFile')

export const loadResourceFile = async ({
  registry,
  root,
  path,
  resourceType,
  level = 0,
}: LoadOptions): Promise<void> => {
  log(`${'-'.repeat(level)}Loading '%s' documents in [%s] from [%s]`, resourceType, path, root)
  const url = await resolveResourceUrl(root, path, resourceType)

  const resourceDocument = registry.resources[resourceType]?.document
  const loader =
    resourceDocument?.loader ??
    (registry.resources?.resource?.document?.loader as Record<string, unknown>)?.default ??
    'yaml'

  switch (loader) {
    case 'yaml':
      const documents = await readYaml(url)
      await Promise.all(
        documents.map((document, index) =>
          loadDocument(document, url, index, {
            registry,
            root,
            path,
            resourceType,
            level: level + 1,
          }),
        ),
      )
      break
    case 'javascript':
      const exports = await import(url.toString())
      await loadDocument({ exports }, url, 0, {
        registry,
        root,
        path,
        resourceType,
        level: level + 1,
      })
      break
    default:
      throw new Error(`Unknown loader ${loader} for ${resourceType} in ${url}.`)
  }
}
