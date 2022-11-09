import type { DependencyList } from 'react'
import { useCallback } from 'react'

const useTypedCallback = <Args extends readonly unknown[], Result>(
  callback: (...args: Args) => Result,
  deps: DependencyList,
): ((...args: Args) => Result) => useCallback(callback, deps)

export default useTypedCallback
