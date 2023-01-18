import { Registry } from "../../common.js";

const baseUrl = new URL('../../../plugins/', import.meta.url)

const yamlLoaderUrl = new URL('core/scripts/loaders/yaml.js', baseUrl)
const jsLoaderUrl = new URL('core/scripts/loaders/js.js', baseUrl)

const createMinimumViableRegistry = async (): Promise<Registry> => ({
  sites: {},
  plugins: {},
  javascripts: {
    'loaders/yaml': {
      meta: {
        id: 'loaders/yaml',
        url: yamlLoaderUrl,
        index: 0,
        name: 'loaders/yaml',
        siteId: undefined,
        pluginId: 'core'
      },
      document: await import(yamlLoaderUrl.toString()),
    },
    'loaders/js': {
      meta: {
        id: 'loaders/js',
        url: jsLoaderUrl,
        index: 0,
        name: 'loaders/js',
        siteId: undefined,
        pluginId: 'core'
      },
      document: await import(jsLoaderUrl.toString()),
    }
  },
  loaders: {
    yaml: {
      meta: {
        id: 'yaml',
        url: yamlLoaderUrl,
        index: 0,
        name: 'yaml',
        siteId: undefined,
        pluginId: 'core'
      },
      document: { name: 'yaml', scriptType: 'js', script: 'loaders/yaml' },
    },
    js: {
      meta: {
        id: 'js',
        url: jsLoaderUrl,
        index: 0,
        name: 'js',
        siteId: undefined,
        pluginId: 'core'
      },
      document: { name: 'js', scriptType: 'js', script: 'loaders/js' },
    }
  },
  resources: {
    site: {
      meta: {
        id: 'site',
        url: new URL('core/resources/site.resource', baseUrl),
        index: 0,
        name: 'site',
        siteId: undefined,
        pluginId: 'core'
      },
      document: { name: 'site', collection: 'sites', extensible: true },
    },
    plugin: {
      meta: {
        id: 'plugin',
        url: new URL('core/resources/plugin.resource', baseUrl),
        index: 0,
        name: 'plugin',
        siteId: undefined,
        pluginId: 'core'
      },
      document: { name: 'plugin', collection: 'plugins', extensible: true },
    },
    js: {
      meta: {
        id: 'js',
        url: new URL('core/resources/js.resource', baseUrl),
        index: 0,
        name: 'js',
        siteId: undefined,
        pluginId: 'core'
      },
      document: { name: 'js', collection: 'javascripts', early: true, loader: 'js' },
    },
    loader: {
      meta: {
        id: 'loader',
        url: new URL('core/resources/loader.resource', baseUrl),
        index: 0,
        name: 'loader',
        siteId: undefined,
        pluginId: 'core'
      },
      document: { name: 'loader', collection: 'loaders', early: true },
    },
    resource: {
      meta: {
        id: 'resource',
        url: new URL('core/resources/resource.resource', baseUrl),
        index: 0,
        name: 'resource',
        siteId: undefined,
        pluginId: 'core'
      },
      document: { name: 'resource', collection: 'resources', early: true },
    },
  }
})

export default createMinimumViableRegistry
