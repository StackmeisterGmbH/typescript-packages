import type { MutableRefObject, RefObject } from 'react'
import { type RefCallback, useRef, useState } from 'react'
import useMergedRef from '@stackmeister/react-use-merged-ref'
import { useTypedCallback } from '@stackmeister/react-use-stable'

const useReactiveRef = <Value>(
  initialValue: Value | null = null,
  skipInitial = true,
): {
  readonly ref: RefCallback<Value>
  readonly inspect: RefObject<Value | null>
} => {
  const inspect: MutableRefObject<Value | null> = useRef(initialValue)
  const initialized = useRef(false)
  const [, rerender] = useState({})

  const merged = useMergedRef(
    inspect,
    useTypedCallback(current => {
      inspect.current = current

      rerender(prevState => {
        if (skipInitial && !initialized.current) {
          initialized.current = true
          return prevState
        }
        return {}
      })
    }, []),
  )

  return { ref: merged, inspect }
}

export default useReactiveRef
