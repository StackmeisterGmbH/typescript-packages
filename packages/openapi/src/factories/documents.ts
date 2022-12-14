import type DocumentObject from '../objects/DocumentObject'
import type { Transformer } from '../utils/fn'
import { transform } from '../utils/fn'

export const document = (...transformers: Transformer<DocumentObject>[]): DocumentObject => {
  const document = {
    openapi: '3.1.0',
    info: { title: 'Untitled API', version: '1.0.0' },
    paths: {},
  }
  return transform(...transformers)(document)
}
