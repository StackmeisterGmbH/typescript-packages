import type { LoadOptions } from '../common.js'
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
  documentId: string,
  options: LoadOptions
) => {
  const collection = options.registry.resources[options.resourceType]?.document.collection as string | undefined
  if (!collection) {
    throw new Error(`Invalid ${options.resourceType}, should have a collection defined.`)
  }
  const document = options.registry[collection][documentId].document
  if (!document) {
    throw new Error(`Invalid ${options.resourceType} ${documentId}, should have a document defined.`)
  }
  const documentUrl = options.registry[collection][documentId].meta.url

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
        `Invalid ${options.resourceType} in ${documentUrl}, ${collection} should be an array.`,
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
            ...options,
            baseUrl: bundledPluginsPath,
            path: item,
            resourceType: entryResourceType,
          })
          return
        }

        if (isFileReference(item)) {
          await loadResourceFile({
            ...options,
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
                ...options,
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
  log('Extensible load of %s', documentId)
  const extensibles = Object.values(options.registry.resources)
    .map(({ document }) => document)
    .filter(({ extensible }) => extensible)
    .map(loadExtensions)
  await Promise.all(extensibles)

  log('Now known resources: %o, loaders: %o', Object.keys(options.registry.resources), Object.keys(options.registry.loaders))
  // With the whole plugin/site structure known (at least) we load everything
  // that needs to loads early. This is, most importantly, all the resources
  log('Early load of %s', documentId)
  const earlies = Object.values(options.registry.resources)
    .map(({ document }) => document)
    .filter(({ early }) => early)
    .map(loadExtensions)
  await Promise.all(earlies)

  log('Now known resources: %o, loaders: %o', Object.keys(options.registry.resources), Object.keys(options.registry.loaders))
  // With probably all resources known, we will now initialize
  // _everything_ again, equipped with all required knowledge
  // This way, even resources can extend themselves by other resources
  // if wanted
  log('Latest load of %s', documentId)
  const latest = Object.values(options.registry.resources)
    .map(({ document }) => document)
    .filter(({ early }) => !early)
    .map(loadExtensions)
  await Promise.all(latest)
  log('Now known resources: %o, loaders: %o', Object.keys(options.registry.resources), Object.keys(options.registry.loaders))
}

export default loadExtensions
