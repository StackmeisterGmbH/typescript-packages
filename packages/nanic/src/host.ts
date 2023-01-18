import type { IncomingMessage, ServerResponse } from 'http'
import { Registry } from './common.js'
import { createQueryHost } from './query.js'
import { isFunction } from '@stackmeister/types'
import { match } from 'path-to-regexp'
import { loadResourceFile } from './loaders/loadResourceFile.js'
import debug from 'debug'
import createMinimumViableRegistry from './utils/registry/createMinimumViableRegistry.js'

const log = debug('nanic:host')

export type HostOptions = {
  readonly baseUrl: URL
  readonly sitePaths: string[]
}

export type Host = {
  readonly registry: Registry
  readonly reload: () => Promise<void>
  readonly handleRequest: (req: IncomingMessage, res: ServerResponse) => void
  readonly query: ReturnType<typeof createQueryHost>['query']
}

export const createHost = async ({ baseUrl, sitePaths }: HostOptions): Promise<Host> => {
  log('Creating host in %s for %o', baseUrl, sitePaths)
  const registry = await createMinimumViableRegistry()

  const reload = async (): Promise<void> => {
    log('Initializing registry...')
    await Promise.all(
      sitePaths.map(path =>
        loadResourceFile({
          registry,
          baseUrl,
          path,
          resourceType: 'site',
          currentSiteId: undefined,
          currentPluginId: undefined,
        })
      ),
    )
    log('Registry initialized')
  }
  await reload()

  const { query } = createQueryHost(registry)

  const handleRequest = (req: IncomingMessage, res: ServerResponse): void => {
    log('%s %s', req.method, req.url)
    for (const endpoint of Object.values(registry.endpoints)) {
      log('Matching path %s against %s', endpoint.document.path, req.url)
      const matchPath = match(endpoint.document.path as string)
      const result = matchPath(req.url ?? '/')
      log('Result: %o', result)
      if (!result) {
        continue
      }

      log('Endpoint %s matched', endpoint.document.name)
      const script = Object.values(registry.javascripts).find(
        ({ meta }) => meta.name === (endpoint.document.script as string),
      )

      if (!script) {
        log(
          '-  No script %s found for endpoint %s',
          endpoint.document.script,
          endpoint.document.name,
        )
        res.writeHead(404)
        res.end()
        return
      }

      if (!isFunction(script.document.handleRequest)) {
        log('-  Script %s has no exports function', script.meta.name)
        res.writeHead(404)
        res.end()
        return
      }

      script.document.handleRequest({ req, res, params: result.params, query, registry })
      return
    }

    log('- No endpoint matched')
    res.writeHead(404)
    res.end()
  }

  return {
    registry,
    reload,
    handleRequest,
    query,
  }
}
