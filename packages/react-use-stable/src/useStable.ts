import type { MutableRefObject } from 'react'
import { useMemo } from 'react'
import useLayoutRef from './useLayoutRef'

const useStable = <Dependencies extends readonly unknown[], Result>(
  callback: (
    ...args: {
      readonly [Index in keyof Dependencies]: MutableRefObject<Dependencies[Index]>
    }
  ) => Result,
  deps: Dependencies,
): Result => {
  const refs = deps.map(value => useLayoutRef(value))
  return useMemo(() => callback(...(refs as never)), [])
}

export default useStable
