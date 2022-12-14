import type DocumentObject from '../objects/DocumentObject'
import type MediaTypeObject from '../objects/MediaTypeObject'
import type OperationObject from '../objects/OperationObject'
import type { Method } from '../objects/PathItemObject'
import type { Path } from '../objects/PathsObject'
import type ReferenceObject from '../objects/ReferenceObject'
import type ResponseObject from '../objects/ResponseObject'
import type { Transformer } from '../utils/fn'
import { always, transform } from '../utils/fn'
import { isRef } from '@stackmeister/json-schema'
import type { ParameterLocation } from '../objects/ParameterObject'
import type ParameterObject from '../objects/ParameterObject'
import { componentDefaults } from './components'

export const operation =
  (method: Method) =>
  (path: Path) =>
  (...transformers: Transformer<OperationObject>[]): Transformer<DocumentObject> =>
  document => ({
    ...document,
    paths: {
      ...document.paths,
      [path]: {
        ...document.paths?.[path],
        [method]: transform(...transformers)(document.paths?.[path]?.[method] ?? { responses: {} }),
      },
    },
  })

export const get = operation('get')
export const put = operation('put')
export const post = operation('post')
export const delete_ = operation('delete')
export const options = operation('options')
export const head = operation('head')
export const patch = operation('patch')
export const trace = operation('trace')

export const response =
  (description: string) =>
  (...transformers: Transformer<ResponseObject | ReferenceObject>[]) =>
    always(transform(...transformers)({ description }))

const onResponseCode =
  (code: number) =>
  (
    ...transformers: Transformer<ResponseObject | ReferenceObject>[]
  ): Transformer<OperationObject> =>
  operation => ({
    ...operation,
    responses: {
      ...operation.responses,
      [code]: transform(...transformers)(
        operation.responses?.[code] ?? componentDefaults.responses,
      ),
    },
  })

export const onOk = onResponseCode(200)
export const onCreated = onResponseCode(201)
export const onAccepted = onResponseCode(202)
export const onNoContent = onResponseCode(204)
export const onResetContent = onResponseCode(205)
export const onPartialContent = onResponseCode(206)
export const onMultiStatus = onResponseCode(207)
export const onAlreadyReported = onResponseCode(208)
export const onImUsed = onResponseCode(226)
export const onMultipleChoices = onResponseCode(300)
export const onMovedPermanently = onResponseCode(301)
export const onFound = onResponseCode(302)
export const onSeeOther = onResponseCode(303)
export const onNotModified = onResponseCode(304)
export const onUseProxy = onResponseCode(305)
export const onTemporaryRedirect = onResponseCode(307)
export const onPermanentRedirect = onResponseCode(308)
export const onBadRequest = onResponseCode(400)
export const onUnauthorized = onResponseCode(401)
export const onPaymentRequired = onResponseCode(402)
export const onForbidden = onResponseCode(403)
export const onNotFound = onResponseCode(404)
export const onMethodNotAllowed = onResponseCode(405)
export const onNotAcceptable = onResponseCode(406)
export const onProxyAuthenticationRequired = onResponseCode(407)
export const onRequestTimeout = onResponseCode(408)
export const onConflict = onResponseCode(409)
export const onGone = onResponseCode(410)
export const onLengthRequired = onResponseCode(411)
export const onPreconditionFailed = onResponseCode(412)
export const onPayloadTooLarge = onResponseCode(413)
export const onUriTooLong = onResponseCode(414)
export const onUnsupportedMediaType = onResponseCode(415)
export const onRangeNotSatisfiable = onResponseCode(416)
export const onExpectationFailed = onResponseCode(417)
export const onImATeapot = onResponseCode(418)
export const onMisdirectedRequest = onResponseCode(421)
export const onUnprocessableEntity = onResponseCode(422)
export const onLocked = onResponseCode(423)
export const onFailedDependency = onResponseCode(424)
export const onUpgradeRequired = onResponseCode(426)
export const onPreconditionRequired = onResponseCode(428)
export const onTooManyRequests = onResponseCode(429)
export const onRequestHeaderFieldsTooLarge = onResponseCode(431)
export const onUnavailableForLegalReasons = onResponseCode(451)
export const onInternalServerError = onResponseCode(500)
export const onNotImplemented = onResponseCode(501)
export const onBadGateway = onResponseCode(502)
export const onServiceUnavailable = onResponseCode(503)
export const onGatewayTimeout = onResponseCode(504)
export const onHttpVersionNotSupported = onResponseCode(505)
export const onVariantAlsoNegotiates = onResponseCode(506)
export const onInsufficientStorage = onResponseCode(507)
export const onLoopDetected = onResponseCode(508)
export const onNotExtended = onResponseCode(510)
export const onNetworkAuthenticationRequired = onResponseCode(511)

export const withContent =
  (mediaType: string) =>
  (
    ...transformers: Transformer<MediaTypeObject>[]
  ): Transformer<ResponseObject | ReferenceObject> =>
  response => ({
    ...response,
    content: {
      ...(!isRef(response) ? response?.content : undefined),
      [mediaType]: transform(...transformers)(
        !isRef(response) && !isRef(response?.content?.[mediaType])
          ? response?.content?.[mediaType] ?? {}
          : {},
      ),
    },
  })

export const json = withContent('application/json')
export const xml = withContent('application/xml')
export const csv = withContent('text/csv')
export const tsv = withContent('text/tab-separated-values')
export const html = withContent('text/html')
export const css = withContent('text/css')
export const js = withContent('text/javascript')
export const octetStream = withContent('application/octet-stream')
export const form = withContent('application/x-www-form-urlencoded')
export const multipart = withContent('multipart/form-data')()
export const binary = withContent('application/octet-stream')
export const text = withContent('text/plain')
export const pdf = withContent('application/pdf')()
export const zip = withContent('application/zip')()
export const gzip = withContent('application/gzip')()
export const jpeg = withContent('image/jpeg')()
export const png = withContent('image/png')()
export const gif = withContent('image/gif')()
export const svg = withContent('image/svg+xml')
export const webp = withContent('image/webp')()
export const mp4 = withContent('video/mp4')()
export const mpeg = withContent('video/mpeg')()
export const webm = withContent('video/webm')()
export const mp3 = withContent('audio/mpeg')()
export const wav = withContent('audio/wav')()
export const weba = withContent('audio/webm')()
export const oga = withContent('audio/ogg')()
export const ogg = withContent('audio/ogg')()
export const otf = withContent('font/otf')()
export const ttf = withContent('font/ttf')()
export const woff = withContent('font/woff')()
export const woff2 = withContent('font/woff2')()
export const ico = withContent('image/x-icon')()
export const eot = withContent('application/vnd.ms-fontobject')()

export const parameter =
  (location: ParameterLocation) =>
  (name: string, description: string) =>
  (...transformers: Transformer<ParameterObject | ReferenceObject>[]) =>
    always(
      transform(...transformers)({
        name,
        description,
        in: location,
      }),
    )

export const queryParameter = parameter('query')
export const headerParameter = parameter('header')
export const pathParameter = parameter('path')
export const cookieParameter = parameter('cookie')

export const withParameter =
  (
    ...transformers: Transformer<ParameterObject | ReferenceObject>[]
  ): Transformer<OperationObject> =>
  operation => ({
    ...operation,
    parameters: [
      ...(operation.parameters ?? []),
      transform(...transformers)(componentDefaults.parameters),
    ],
  })
