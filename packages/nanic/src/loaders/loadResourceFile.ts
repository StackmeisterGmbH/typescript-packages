import type { LoadOptions } from '../common.js'
import debug from 'debug'
import resolveResourceUrl from '../utils/resolveResourceUrl.js'
import loadDocument from './loadDocument.js'
import { isFunction, isObject } from '@stackmeister/types'

const log = debug('nanic:loaders:loadResourceFile')

export const loadResourceFile = async (options: LoadOptions): Promise<void> => {
  log(`Loading '%s' documents in [%s] from [%s]`, options.resourceType, options.path, options.baseUrl)
  const url = await resolveResourceUrl(options.baseUrl, options.path, options.resourceType)
  const resourceDocument = options.registry.resources[options.resourceType]?.document
  const loader =
    (resourceDocument?.loader ??
      ((options.registry.resources?.resource?.document?.fields as Record<string, unknown>)?.loader as Record<string, unknown>)?.default ??
      'yaml') as string
  
  const loaderDocument = options.registry.loaders[loader]?.document

  if (!loaderDocument) {
    throw new Error(`Unknown loader ${loader} for ${options.resourceType} in ${url}.`)
  }

  log('Using loader %o, resdoc: %o', loaderDocument, resourceDocument)

  const loaderScript = options.registry.javascripts[loaderDocument.script as string]?.document

  if (!isObject(loaderScript)) {
    throw new Error(`Unknown loader script ${loaderDocument.script} for ${options.resourceType} in ${url}, available ones are ${JSON.stringify(Object.keys(options.registry.javascripts))}`)
  }

  if (!isFunction(loaderScript.load)) {
    throw new Error(`Loader script ${loaderDocument.script} for ${options.resourceType} in ${url} does not have a read function.`)
  }

  const documents = await loaderScript.load(url) as unknown[]

  await Promise.all(
    documents.map((document, index) =>
      loadDocument(document, url, index, documents.length, options),
    ),
  )
}
