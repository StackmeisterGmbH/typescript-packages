import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

const useReinitializedRefs = <Values extends readonly unknown[]>(
  active = false,
  initialValues: Values,
): {
  readonly [Index in keyof Values]: MutableRefObject<Values[Index]>
} => {
  const initialized = useRef(active)
  const refs = initialValues.map(value => useRef(value))

  useEffect(() => {
    if (!active) {
      initialized.current = false
      return
    }
    if (initialized.current) {
      return
    }
    initialValues.forEach((value, index) => (refs[index].current = value))
  }, [active])

  return refs as never
}

export default useReinitializedRefs
