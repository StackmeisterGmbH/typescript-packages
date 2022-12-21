export const bundledPluginsPath = new URL('../plugins/', import.meta.url)

export type Path = string
export type ResourceType = string
export type DocumentMeta = {
  readonly id: string
  readonly name: string
  readonly index: number
  readonly url: URL
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
}

export const createMinimumViableRegistry = (): Registry => ({
  sites: {},
  plugins: {},
  resources: {
    site: {
      meta: {
        id: 'site',
        url: new URL('file:///core.plugin'),
        index: 0,
        name: 'site',
      },
      document: { name: 'site', collection: 'sites', extensible: true },
    },
    plugin: {
      meta: {
        id: 'plugin',
        url: new URL('file:///core.plugin'),
        index: 0,
        name: 'plugin',
      },
      document: { name: 'plugin', collection: 'plugins', extensible: true },
    },
    resource: {
      meta: {
        id: 'resource',
        url: new URL('file:///core.plugin'),
        index: 0,
        name: 'resource',
      },
      document: { name: 'resource', collection: 'resources', early: true },
    },
  },
})
