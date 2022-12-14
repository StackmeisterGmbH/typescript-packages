import type DocumentObject from '../objects/DocumentObject'
import type { Transformer } from '../utils/fn'

export const title =
  (title: string): Transformer<DocumentObject> =>
  document => ({
    ...document,
    info: { ...document.info, title },
  })
export const version =
  (version: string): Transformer<DocumentObject> =>
  document => ({
    ...document,
    info: { ...document.info, version },
  })

export const description =
  (description: string): Transformer<DocumentObject> =>
  document => ({
    ...document,
    info: { ...document.info, description },
  })

export const termsOfService =
  (termsOfService: string): Transformer<DocumentObject> =>
  document => ({
    ...document,
    info: { ...document.info, termsOfService },
  })

export const contact =
  (name?: string, email?: string, url?: string): Transformer<DocumentObject> =>
  document => ({
    ...document,
    info: { ...document.info, contact: { name, email, url } },
  })

export const license =
  (name: string, url?: string): Transformer<DocumentObject> =>
  document => ({
    ...document,
    info: { ...document.info, license: { name, url } },
  })
