export const bundledPluginsPath = new URL('../plugins/', import.meta.url)

export type Path = string
export type ResourceType = string
export type DocumentMeta = {
  readonly id: string
  readonly name: string
  readonly index: number
  readonly url: URL
  readonly siteId: string | undefined
  readonly pluginId: string | undefined
}

export type FileReference = { readonly at: Path }
export type DirectoryReference = { readonly in: Path }

export type Document = Record<string, unknown>

export type ResourceEntry = {
  readonly meta: DocumentMeta
  readonly document: Document
}

export type Registry = Record<ResourceType, Record<string, ResourceEntry>>

export type LoadOptions = {
  readonly registry: Registry
  readonly baseUrl: URL
  readonly path: Path
  readonly resourceType: ResourceType
  readonly currentSiteId: string | undefined
  readonly currentPluginId: string | undefined
}
