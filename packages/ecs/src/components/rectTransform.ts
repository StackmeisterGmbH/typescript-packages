import type { ComponentMessages, ComponentProps } from '../components'
import { createComponent } from '../components'

const rectTransform = createComponent({
  id: Symbol('rectTransform'),
  name: 'rectTransform',
  initialProps: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  onMessage: () => {},
})

export type TransformProps = ComponentProps<typeof rectTransform>
export type TransformMessages = ComponentMessages<typeof rectTransform>

export default rectTransform
