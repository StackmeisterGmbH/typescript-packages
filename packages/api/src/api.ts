import type { ApiMiddleware } from './http'
import type { Document, Path, Method } from '@stackmeister/openapi'
import { createNodeHandler } from './http'

export type ApiController = object

export type ApiManifest = {
  readonly middleware: ApiMiddleware<unknown, unknown, unknown, unknown>[]
  readonly mounts: Record<Path, ApiController>
  readonly baseSpec: Document
}

export const emptyApiManifest: ApiManifest = {
  middleware: [],
  mounts: {},
  baseSpec: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
    },
    paths: {},
  },
}

export class ApiBuilder<RequestBody, ResponseBody> {
  constructor(public readonly manifest: ApiManifest = emptyApiManifest) {}

  get handler() {
    return createNodeHandler(this.manifest.middleware)
  }

  use<ReturnRequestBody, ReturnResponseBody>(
    middleware: ApiMiddleware<RequestBody, ResponseBody, ReturnRequestBody, ReturnResponseBody>,
  ): ApiBuilder<ReturnRequestBody, ReturnResponseBody> {
    return new ApiBuilder({
      ...this.manifest,
      middleware: [
        ...this.manifest.middleware,
        middleware as ApiMiddleware<unknown, unknown, unknown, unknown>,
      ],
    })
  }

  mount(path: Path, controller: ApiController): ApiBuilder<RequestBody, ResponseBody> {
    return new ApiBuilder({
      ...this.manifest,
      mounts: {
        ...this.manifest.mounts,
        [path]: controller,
      },
    })
  }

  async listen(port: number, hostname?: string, backlog?: number): Promise<void> {
    const server = (await import('node:http')).default.createServer(this.handler)
    return new Promise(resolve => server.listen(port, hostname, backlog, () => resolve()))
  }
}
