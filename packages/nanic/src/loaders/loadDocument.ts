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
  { registry, resourceType, path }: LoadOptions,
): Promise<void> => {
  log(`Loading '%s' document %d in [%s]`, resourceType, index, url)

  if (!isObject(document)) {
    throw new Error(`Invalid ${resourceType} in ${url}, should be a structure.`)
  }

  const documentResourceType = (document.resourceType as string | undefined) ?? resourceType
  const resourceTypeDocument = registry.resources[documentResourceType]?.document
  if (!isObject(resourceTypeDocument)) {
    throw new Error(
      `Invalid ${resourceType} in ${url}, should have a resource type defined. Are you missing a resource definition for ${resourceType}?`,
    )
  }

  const documentCollection = getCollectionForResourceType(registry, documentResourceType)
  const documentName = (document.name as string | undefined) ?? path.replace('\\', '/')
  const documentId =
    (document.id as string | undefined) ??
    (document.name as string | undefined) ??
    `${path.replace('\\', '/')}[${index}]`

  const meta: DocumentMeta = {
    id: documentId,
    name: documentName,
    index,
    url,
  }

  if (!isObject(registry[documentCollection])) {
    registry[documentCollection] = {}
  }

  registry[documentCollection][documentId] = {
    meta,
    document: document as Document,
  }

  if (registry.resources[documentResourceType]?.document.extensible) {
    await loadExtensions(resourceType, documentId, registry)
  }
}

export default loadDocument
