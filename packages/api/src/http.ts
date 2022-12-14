import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Readable, Writable } from 'node:stream'
import { Stream } from 'node:stream'

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiHeaders = Record<string, string | string[]>

export type ApiRequest<Body> = {
  readonly method: ApiMethod
  readonly headers: ApiHeaders
  readonly body: Body
}

export type ApiResponse<Body> = {
  readonly status: number
  readonly headers: ApiHeaders
  readonly body: Body
}

export type RequestResponse<RequestBody, ResponseBody> = {
  readonly request: ApiRequest<RequestBody>
  readonly response: ApiResponse<ResponseBody>
}

export type ApiMiddlewareResult<RequestBody, ResponseBody> =
  | RequestResponse<RequestBody, ResponseBody>
  | Promise<RequestResponse<RequestBody, ResponseBody>>

export type ApiMiddleware<RequestBody, ResponseBody, ReturnRequestBody, ReturnResponseBody> = (
  request: ApiRequest<RequestBody>,
  response: ApiResponse<ResponseBody>,
) =>
  | Promise<ApiMiddlewareResult<ReturnRequestBody, ReturnResponseBody>>
  | ApiMiddlewareResult<ReturnRequestBody, ReturnResponseBody>

export const apiRequestFromNodeRequest = (req: IncomingMessage): ApiRequest<Readable> => {
  return {
    method: req.method as ApiMethod,
    headers: req.headers as ApiHeaders,
    body: req,
  }
}

export const nodeResponseToApiResponse = (res: ServerResponse): ApiResponse<Writable> => {
  return {
    status: res.statusCode,
    headers: res.getHeaders() as ApiHeaders,
    body: res,
  }
}

export const writeBodyToNodeResponse = (body: unknown, res: ServerResponse): void => {
  if (body instanceof Stream) {
    body.pipe(res)
    return
  }
  res.write(JSON.stringify(body))
  res.end()
}

export const createNodeHandler = (
  middlewareList: ApiMiddleware<unknown, unknown, unknown, unknown>[],
) => {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const request = apiRequestFromNodeRequest(req)
    const response = nodeResponseToApiResponse(res)

    const { response: finalResponse } = await middlewareList.reduce(
      async (
        prev: ApiMiddlewareResult<unknown, unknown>,
        middleware: ApiMiddleware<unknown, unknown, unknown, unknown>,
      ) => {
        const prevResult = await prev
        return middleware(prevResult.request, prevResult.response)
      },
      Promise.resolve({ request, response }),
    )

    res.writeHead(finalResponse.status, finalResponse.headers)
    writeBodyToNodeResponse(finalResponse.body, res)
  }
}
