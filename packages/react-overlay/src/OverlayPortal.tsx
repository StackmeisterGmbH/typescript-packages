import type { PropsWithChildren } from 'react'
import type { OverlayContainerOptions } from './useOverlayContainer'
import { createPortal } from 'react-dom'
import useOverlayContainer from './useOverlayContainer'

export type OverlayPortalProps = {
  readonly containerOptions?: OverlayContainerOptions
}

export default ({ containerOptions, children }: PropsWithChildren<OverlayPortalProps>) => {
  const containerElement = useOverlayContainer(containerOptions)
  // Create the actual portal
  return createPortal(children, containerElement)
}
