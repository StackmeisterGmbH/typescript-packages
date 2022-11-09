import { useEffect, useMemo } from 'react'

export type OverlayContainerOptions = {
  readonly tagName?: 'div'
  readonly attributes?: { readonly [key: string]: string }
  readonly target?: HTMLElement
}

const defaultAttributes = {}

const useOverlayContainer = ({
  tagName = 'div',
  attributes = defaultAttributes,
  target = globalThis.document?.body,
}: OverlayContainerOptions = {}): HTMLElement | undefined => {
  const containerElement = useMemo(() => {
    if (!('document' in globalThis)) {
      return
    }
    const element = document.createElement(tagName)
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
    return element
  }, [attributes])

  useEffect(() => {
    if (!containerElement || !target) {
      return
    }
    target.appendChild(containerElement)
    return () => {
      target.removeChild(containerElement)
    }
  }, [containerElement])

  return containerElement
}

export default useOverlayContainer
