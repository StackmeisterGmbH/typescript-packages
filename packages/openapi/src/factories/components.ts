import type DocumentObject from '../objects/DocumentObject'
import type ComponentsObject from '../objects/ComponentsObject'
import type { Transformer } from '../utils/fn'
import type ReferenceObject from '../objects/ReferenceObject'
import { ref } from '@stackmeister/json-schema'
import { transform } from '../utils/fn'

export type AddableComponentType =
  | 'schemas'
  | 'responses'
  | 'parameters'
  | 'examples'
  | 'requestBodies'
  | 'headers'
  | 'securitySchemes'
  | 'links'
  | 'callbacks'

export const componentDefaults: {
  [Type in AddableComponentType]: Required<ComponentsObject>[Type][string]
} = {
  schemas: {},
  responses: { description: '' },
  parameters: { name: '', in: 'query', schema: {} },
  examples: {},
  requestBodies: { content: {} },
  headers: {},
  securitySchemes: { type: 'apiKey', in: 'header', name: '' },
  links: {},
  callbacks: {},
}

export const addComponent =
  <Type extends AddableComponentType>(type: Type) =>
  (name: string) =>
  (
    ...transformers: Transformer<Required<ComponentsObject>[Type][string]>[]
  ): Transformer<DocumentObject> =>
  document => ({
    ...document,
    components: {
      ...document.components,
      [type]: {
        ...document.components?.[type],
        [name]: transform(...transformers)(
          componentDefaults[type] as Required<ComponentsObject>[Type][string],
        ),
      },
    },
  })

export const addSchema = addComponent('schemas')
export const addResponse = addComponent('responses')
export const addParameter = addComponent('parameters')
export const addExample = addComponent('examples')
export const addRequestBody = addComponent('requestBodies')
export const addHeader = addComponent('headers')
export const addSecurityScheme = addComponent('securitySchemes')
export const addLink = addComponent('links')
export const addCallback = addComponent('callbacks')

export const componentRef =
  <Type extends AddableComponentType>(type: Type) =>
  <Name extends string>(name: Name): ReferenceObject =>
    ref(`#/components/${type}/${name}`)

export const schemaRef = componentRef('schemas')
export const responseRef = componentRef('responses')
export const parameterRef = componentRef('parameters')
export const exampleRef = componentRef('examples')
export const requestBodyRef = componentRef('requestBodies')
export const headerRef = componentRef('headers')
export const securitySchemeRef = componentRef('securitySchemes')
export const linkRef = componentRef('links')
export const callbackRef = componentRef('callbacks')

export const withComponentRef =
  <Type extends AddableComponentType>(type: Type) =>
  <Name extends string>(name: Name) =>
  (): ReferenceObject =>
    componentRef(type)(name)

export const withSchemaRef = withComponentRef('schemas')
export const withResponseRef = withComponentRef('responses')
export const withParameterRef = withComponentRef('parameters')
export const withExampleRef = withComponentRef('examples')
export const withRequestBodyRef = withComponentRef('requestBodies')
export const withHeaderRef = withComponentRef('headers')
export const withSecuritySchemeRef = withComponentRef('securitySchemes')
export const withLinkRef = withComponentRef('links')
export const withCallbackRef = withComponentRef('callbacks')
