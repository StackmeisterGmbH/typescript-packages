import { useState, useEffect } from 'react'

export type UseDocumentVisibilityResult = boolean

const useDocumentVisibility = (): UseDocumentVisibilityResult => {
  const [hidden, setHidden] = useState(() => globalThis.document?.hidden ?? false)
  useEffect(() => {
    const onVisibilityChange = () => setHidden(globalThis.document?.hidden ?? false)
    globalThis.addEventListener?.('visibilitychange', onVisibilityChange)
    return () => {
      globalThis.removeEventListener?.('visibilitychange', onVisibilityChange)
    }
  }, [])
  return hidden
}

export default useDocumentVisibility
