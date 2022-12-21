import type { LoadOptions, Document } from '../common.js'
import { isObject, isString } from '@stackmeister/types'
import debug from 'debug'
import loadExtensions from './loadExtensions.js'

const log = debug('nanic:loaders:loadDocument')

const loadDocument = async (
  document: unknown,
  url: URL,
  index: number,
  { registry, resourceType, path, level = 0 }: LoadOptions,
): Promise<void> => {
  log(`%sLoading '%s' document %d in [%s]`, ' '.repeat(level), resourceType, index, url)

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

  const documentCollection = resourceTypeDocument.collection as string | undefined

  if (!isString(documentCollection)) {
    throw new Error(
      `Invalid ${resourceType} in ${url}, should have a collection defined. Are you missing a resource definition for ${resourceType}?`,
    )
  }

  const documentName = (document.name as string | undefined) ?? path.replace('\\', '/')
  const documentId =
    (document.id as string | undefined) ??
    (document.name as string | undefined) ??
    `${path.replace('\\', '/')}[${index}]`

  const meta = {
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
    await loadExtensions(resourceType, documentId, registry, level)
  }
}

export default loadDocument
