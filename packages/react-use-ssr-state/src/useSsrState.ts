import type { Dispatch } from 'react'
import { useEffect, useState } from 'react'

// see https://nextjs.org/docs/messages/react-hydration-error
const useSsrState = <S>(firstRender: S, secondRender: S): readonly [S, Dispatch<S>] => {
  const [state, setState] = useState(firstRender)
  useEffect(() => setState(secondRender), [])
  return [state, setState]
}

export default useSsrState
