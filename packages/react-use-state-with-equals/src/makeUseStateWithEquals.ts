import { useCallback, useState } from 'react'

const makeUseStateWithEquals = <T>(
  equals: (previousState: T, nextState: T) => boolean,
): typeof useState<T> =>
  (initialState => {
    const [state, setState] = useState<T>(initialState)
    const setStateIfDifferent: typeof setState = useCallback(
      value =>
        void setState(previousState => {
          const nextState =
            typeof value === 'function' ? (value as (previousState: T) => T)(previousState) : value
          return equals(previousState, nextState) ? previousState : nextState
        }),
      [equals],
    )
    return [state, setStateIfDifferent]
  }) as typeof useState<T>

export default makeUseStateWithEquals
