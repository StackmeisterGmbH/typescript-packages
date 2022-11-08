import { useLayoutEffect, useRef } from 'react'

const useLayoutRef = <T>(value: T) => {
  const ref = useRef(value)
  useLayoutEffect(() => void (ref.current = value), [value])
  return ref
}

export default useLayoutRef
