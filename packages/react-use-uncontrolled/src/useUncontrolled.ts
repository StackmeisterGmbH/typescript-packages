import type { Dispatch, RefCallback, SetStateAction } from 'react'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import useReactiveRef from '@stackmeister/react-use-reactive-ref'
import useStable from '@stackmeister/react-use-stable'
import makeUseStateWithEquals from '@stackmeister/react-use-state-with-equals'

const useUncontrolled = <Element, Value>(
  getValue: (element: Element) => Value,
  setValue: (element: Element, value: Value, initial: boolean) => void,
  initialState: Value,
  equals: (previous: Value, next: Value) => boolean = (previous, next) => previous === next,
): {
  readonly ref: RefCallback<Element>
  readonly state: readonly [state: Value, setState: Dispatch<SetStateAction<Value>>]
  readonly onChange: () => void
} => {
  const { ref, inspect } = useReactiveRef<Element>()
  const useEqState = useMemo(() => makeUseStateWithEquals(equals), [equals])
  const [state, setState] = useEqState(initialState)

  const initialized = useRef(false)

  const onChange = useCallback(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }
    const { current } = inspect
    if (current !== null) {
      setState(getValue(current))
    }
  }, [inspect.current, getValue])

  const setDomValue = useStable(
    (getValue, setValue) => (value: Value | ((previous: Value) => Value)) => {
      const { current } = inspect
      if (current === null) {
        return
      }

      const previous = getValue.current(current)
      const next = (typeof value === 'function' ? (value as Function)(previous) : value) as Value

      if (!equals(previous, next)) {
        setValue.current(current, next, !initialized.current)
      }
    },
    [getValue, setValue] as const,
  )

  useLayoutEffect(() => {
    if (initialized.current) {
      return
    }
    if (inspect.current === null) {
      initialized.current = false
      return
    }
    setDomValue(initialState)
  }, [initialized.current, inspect.current])

  return { ref, onChange, state: [state, setDomValue] }
}

export default useUncontrolled
