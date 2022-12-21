import type { LoadOptions } from '../common.js'
import debug from 'debug'
import resolveResourceUrl from '../utils/resolveResourceUrl.js'
import readYaml from '../utils/readYaml.js'
import loadDocument from './loadDocument.js'

const log = debug('nanic:loaders:loadResourceFile')

export const loadResourceFile = async ({
  registry,
  baseUrl,
  path,
  resourceType,
}: LoadOptions): Promise<void> => {
  log(`Loading '%s' documents in [%s] from [%s]`, resourceType, path, baseUrl)
  const url = await resolveResourceUrl(baseUrl, path, resourceType)
  const document = registry.resources[resourceType]?.document
  const loader =
    document?.loader ??
    (registry.resources?.resource?.document?.loader as Record<string, unknown>)?.default ??
    'yaml'

  switch (loader) {
    case 'yaml':
      const documents = await readYaml(url)
      await Promise.all(
        documents.map((document, index) =>
          loadDocument(document, url, index, {
            registry,
            baseUrl,
            path,
            resourceType,
          }),
        ),
      )
      break
    case 'javascript':
      const exports = await import(url.toString())
      await loadDocument({ exports }, url, 0, {
        registry,
        baseUrl,
        path,
        resourceType,
      })
      break
    default:
      throw new Error(`Unknown loader ${loader} for ${resourceType} in ${url}.`)
  }
}
