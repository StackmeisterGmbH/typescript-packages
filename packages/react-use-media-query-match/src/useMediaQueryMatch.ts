import { useEffect, useState } from 'react'

const addListener = (
  queryList: MediaQueryList,
  handler: (event: MediaQueryListEvent) => void,
): (() => void) => {
  if (queryList.addEventListener) {
    queryList.addEventListener('change', handler)
    return () => queryList.removeEventListener('change', handler)
  }
  queryList.addListener(handler)
  return () => queryList.removeListener(handler)
}

const getInitialValue = (query: string): boolean => {
  if (!('matchMedia' in globalThis)) {
    return false
  }
  return matchMedia(query).matches
}

export type UseMediaQueryMatchResult = boolean

const useMediaQueryMatch = (query: string): UseMediaQueryMatchResult => {
  const [matches, setMatches] = useState(() => getInitialValue(query))

  useEffect(() => {
    if (!('matchMedia' in globalThis)) {
      return
    }

    const queryList = matchMedia(query)
    setMatches(queryList.matches)
    return addListener(queryList, event => setMatches(event.matches))
  }, [query])

  return matches
}

export default useMediaQueryMatch
