import type { Registry, ResourceType } from '../common.js'
import { isArray } from '@stackmeister/types'
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundledPluginsPath } from '../common.js'
import findInDirectory from '../utils/findInDirectory.js'
import isDirectoryReference from '../utils/isDirectoryReference.js'
import isFileReference from '../utils/isFileReference.js'
import { loadResourceFile } from './loadResourceFile.js'
import sanitizeDirectoryUrl from '../utils/sanitizeDirectoryUrl.js'
import urlDirname from '../utils/urlDirname.js'
import debug from 'debug'

const log = debug('nanic:loaders:loadExtensions')

const loadExtensions = async (
  resourceType: ResourceType,
  documentId: string,
  registry: Registry,
) => {
  const collection = registry.resources[resourceType]?.document.collection as string | undefined
  if (!collection) {
    throw new Error(`Invalid ${resourceType}, should have a collection defined.`)
  }
  const document = registry[collection][documentId].document
  if (!document) {
    throw new Error(`Invalid ${resourceType} ${documentId}, should have a document defined.`)
  }
  const documentUrl = registry[collection][documentId].meta.url

  const relativeBaseUrl = sanitizeDirectoryUrl(urlDirname(documentUrl))

  const loadExtensions = async (resourceDocument: Record<string, unknown>) => {
    log(`Loading extensions '%s' for %s in [%s]`, resourceDocument.name, documentId, documentUrl)
    const entryResourceType = resourceDocument.name as string
    const collection = resourceDocument.collection as string

    // Document doesn't have extensions of this type
    if (!(collection in document)) {
      log(`No extensions for '%s' %s in [%s]`, resourceDocument.name, documentId, documentUrl)
      return
    }

    const items = document[collection]
    if (!isArray(items)) {
      throw new Error(
        `Invalid ${resourceType} in ${documentUrl}, ${collection} should be an array.`,
      )
    }

    log(
      `Loading %d extensions for '%s' %s in [%s]`,
      items.length,
      resourceDocument.name,
      documentId,
      documentUrl,
    )
    return Promise.all(
      items.map(async item => {
        if (typeof item === 'string') {
          await loadResourceFile({
            registry,
            baseUrl: bundledPluginsPath,
            path: item,
            resourceType: entryResourceType,
          })
          return
        }

        if (isFileReference(item)) {
          await loadResourceFile({
            registry,
            baseUrl: relativeBaseUrl,
            path: item.at,
            resourceType: entryResourceType,
          })
          return
        }

        if (isDirectoryReference(item)) {
          const findRoot = new URL(item.in, relativeBaseUrl)
          const foundPaths = await findInDirectory(findRoot, entryResourceType)
          await Promise.all(
            foundPaths.map(foundPath => {
              const relativePath = relative(fileURLToPath(findRoot), foundPath)
              return loadResourceFile({
                registry,
                baseUrl: findRoot,
                path: relativePath.substring(0, relativePath.length - entryResourceType.length - 1),
                resourceType: entryResourceType,
              })
            }),
          )
          return
        }

        throw new Error(
          `Don't know how to load ${entryResourceType} ${JSON.stringify(
            item,
          )} in ${relativeBaseUrl}.`,
        )
      }),
    )
  }
  // First we always load all extensibles known to get a full tree of everything we have
  // registered
  // "registry" will be filled with all "sites" and "plugins" known
  const extensibles = Object.values(registry.resources)
    .map(({ document }) => document)
    .filter(({ extensible }) => extensible)
  await Promise.all(extensibles.map(loadExtensions))
  // With the whole plugin/site structure known (at least) we load everything
  // that needs to loads early. This is, most importantly, all the resources
  const earlies = Object.values(registry.resources)
    .map(({ document }) => document)
    .filter(({ early }) => early)
  await Promise.all(earlies.map(loadExtensions))
  // With probably all resources known, we will now initialize
  // _everything_ again, equipped with all required knowledge
  // This way, even resources can extend themselves by other resources
  // if wanted
  const lates = Object.values(registry.resources)
    .map(({ document }) => document)
    .filter(({ early }) => !early)
  await Promise.all(lates.map(loadExtensions))
}

export default loadExtensions
