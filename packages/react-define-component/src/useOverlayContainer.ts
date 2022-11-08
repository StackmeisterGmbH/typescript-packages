import { useEffect, useMemo } from 'react'

export type OverlayContainerOptions = {
  element?: 'div'
  attributes?: { [key: string]: string }
}

const defaultAttributes = {}

const useOverlayContainer = ({
  element = 'div',
  attributes = defaultAttributes,
}: OverlayContainerOptions = {}) => {
  const containerElement = useMemo(() => {
    const el = document.createElement(element)
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value))
    return el
  }, [attributes])

  useEffect(() => {
    if (!('document' in globalThis)) {
      return
    }

    document.body.appendChild(containerElement)

    return () => {
      containerElement.parentNode?.removeChild(containerElement)
    }
  }, [containerElement])
  return containerElement
}

export default useOverlayContainer
