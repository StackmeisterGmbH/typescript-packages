import type { Dispatch } from 'react'
import { useState } from 'react'

type UseSimpleState = {
  <S>(initialState: S): [S, Dispatch<S>]
  <S = undefined>(): [S | undefined, Dispatch<S | undefined>]
}

// Use when state type is a function, so that react will not interpret it as a setter
const useSimpleState = ((initialState: unknown) => {
  const [state, setState] = useState(
    typeof initialState === 'function' ? () => initialState : initialState,
  )
  return [state, value => setState(() => value)]
}) as UseSimpleState

export default useSimpleState
