import type { ForwardedRef, Ref, RefCallback } from 'react'
import { useCallback } from 'react'

const updateRef = <Value>(ref: ForwardedRef<Value>, value: Value | null): void => {
  if (typeof ref === 'function') {
    ref(value)
  } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
    ref.current = value
  } else {
    throw new Error(`Failed to assign ref: Given ref was not a valid React.ForwardedRef`)
  }
}

const useMergedRef = <Value>(...refs: Ref<Value>[]): RefCallback<Value> =>
  useCallback((value: Value | null): void => {
    refs.forEach(ref => updateRef(ref, value))
  }, refs)

export default useMergedRef
