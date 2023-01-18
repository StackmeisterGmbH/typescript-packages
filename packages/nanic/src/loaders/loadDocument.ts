import type { LoadOptions, Document, DocumentMeta } from '../common.js'
import { isObject } from '@stackmeister/types'
import debug from 'debug'
import loadExtensions from './loadExtensions.js'
import getCollectionForResourceType from '../utils/registry/getCollectionForResourceType.js'

const log = debug('nanic:loaders:loadDocument')

const loadDocument = async (
  document: unknown,
  url: URL,
  index: number,
  length: number,
  options: LoadOptions,
): Promise<void> => {
  log(`Loading '%s' document %d in [%s]`, options.resourceType, index, url)

  if (!isObject(document)) {
    throw new Error(`Invalid ${options.resourceType} in ${url}, should be a structure.\nContent: ${JSON.stringify(document)}`)
  }

  const documentResourceType = (document.resourceType as string | undefined) ?? options.resourceType
  const resourceTypeDocument = options.registry.resources[documentResourceType]?.document
  if (!isObject(resourceTypeDocument)) {
    throw new Error(
      `Invalid ${options.resourceType} in ${url}, should have a resource type defined. Are you missing a resource definition for ${options.resourceType}?`,
    )
  }

  const documentCollection = getCollectionForResourceType(options.registry, documentResourceType)
  const documentName = (document.name as string | undefined) ?? options.path.replace('\\', '/')
  const documentId =
    (document.id as string | undefined) ??
    (document.name as string | undefined) ??
    `${options.path.replace('\\', '/')}${length > 1 ? `[${index}]` : ''}`

  const meta: DocumentMeta = {
    id: documentId,
    name: documentName,
    index,
    url,
    siteId: options.currentSiteId,
    pluginId: options.currentPluginId,
  }

  if (!isObject(options.registry[documentCollection])) {
    options.registry[documentCollection] = {}
  }

  options.registry[documentCollection][documentId] = {
    meta,
    document: document as Document,
  }

  if (options.registry.resources[documentResourceType]?.document.extensible) {
    await loadExtensions(documentId, options)
  }
}

export default loadDocument
