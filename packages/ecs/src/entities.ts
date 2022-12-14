import type { ComponentWithPropsTuple } from './components'

export type Entity = {
  readonly componentData: Record<symbol, unknown>
}

export const createEntity = (components: readonly ComponentWithPropsTuple<unknown>[]) => ({
  componentData: components.reduce((data, [component, props]) => {
    data[component.id] = props
    return data
  }, {} as Record<symbol, unknown>),
})
