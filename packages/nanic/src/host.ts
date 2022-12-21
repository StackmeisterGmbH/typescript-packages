import type { IncomingMessage, ServerResponse } from 'http'
import { createMinimumViableRegistry, createResourceFileLoader } from './common.js'
import debug from 'debug'
import { createQueryHost } from './query.js'
import { isFunction, isObject } from '@stackmeister/types'
import { match } from 'path-to-regexp'

const log = debug('nanic:host')

export type HostOptions = {
  readonly root: URL
  readonly sitePaths: string[]
  readonly watch?: boolean
}

export const createHost = async ({ root, sitePaths, watch }: HostOptions) => {
  log('Creating host in %s for %o', root, sitePaths)
  const registry = createMinimumViableRegistry()

  log('Initializing registry...')
  const abortController = new AbortController()
  await Promise.all(
    sitePaths.map(path =>
      createResourceFileLoader({
        registry,
        root,
        path,
        resourceType: 'site',
        watch,
        watchAbortSignal: abortController.signal,
      }),
    ),
  )
  log('Registry initialized')

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

      if (!isObject(script.document.exports) || !isFunction(script.document.exports.default)) {
        log('-  Script %s has no exports function', script.meta.name)
        res.writeHead(404)
        res.end()
        return
      }

      script.document.exports.default({ req, res, params: result.params, query, registry })
      return
    }

    log('- No endpoint matched')
    res.writeHead(404)
    res.end()
  }

  return {
    handleRequest,
    getRegistry: () => registry,
    query,
  }
}
