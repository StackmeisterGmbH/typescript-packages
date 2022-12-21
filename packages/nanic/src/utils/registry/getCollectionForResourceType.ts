import { isObject, isString } from '@stackmeister/types'
import type { Registry, ResourceType } from '../../common.js'

const getCollectionForResourceType = (registry: Registry, resourceType: ResourceType): string => {
  const resourceTypeDocument = registry.resources[resourceType]?.document
  if (!isObject(resourceTypeDocument)) {
    throw new Error(
      `Invalid ${resourceType}, should have a document defined. Are you missing a resource definition for ${resourceType}?`,
    )
  }

  const collection = resourceTypeDocument.collection as string | undefined
  if (!isString(collection)) {
    throw new Error(
      `Invalid ${resourceType}, should have a collection defined. Are you missing a resource definition for ${resourceType}?`,
    )
  }
  return collection
}

export default getCollectionForResourceType
