import type { PropsWithChildren } from 'react'
import type { OverlayContainerOptions } from './useOverlayContainer'
import { createElement } from 'react'
import { createPortal } from 'react-dom'
import useOverlayContainer from './useOverlayContainer'

export type OverlayPortalProps = {
  readonly containerOptions?: OverlayContainerOptions
}

const OverlayPortal = ({ containerOptions, children }: PropsWithChildren<OverlayPortalProps>) => {
  const containerElement = useOverlayContainer(containerOptions)
  if (!containerElement) {
    return createElement(containerOptions?.tagName ?? 'div', null, children)
  }
  // Create the actual portal
  return createPortal(children, containerElement)
}

export default OverlayPortal
