import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export type UseIntersectionObserverResultEntry = Omit<IntersectionObserverEntry, 'target'>

export type UseIntersectionObserverResult<ElementType extends HTMLElement> = {
  readonly ref: MutableRefObject<ElementType | null>
  readonly entry: UseIntersectionObserverResultEntry
}

const emptyRect: DOMRectReadOnly = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: () => JSON.stringify(emptyRect),
}
const emptyResult: UseIntersectionObserverResultEntry = {
  boundingClientRect: emptyRect,
  intersectionRatio: 0,
  intersectionRect: emptyRect,
  isIntersecting: false,
  rootBounds: emptyRect,
  time: 0,
}

const toResultEntry = (entry: IntersectionObserverEntry): UseIntersectionObserverResultEntry => ({
  boundingClientRect: entry.boundingClientRect,
  intersectionRatio: entry.intersectionRatio,
  intersectionRect: entry.intersectionRect,
  isIntersecting: entry.isIntersecting,
  rootBounds: entry.rootBounds,
  time: entry.time,
})

const useIntersectionObserver = <ElementType extends HTMLElement>(
  options?: IntersectionObserverInit,
): UseIntersectionObserverResult<ElementType> => {
  const ref = useRef<ElementType | null>(null)
  const [entry, setEntry] = useState(emptyResult)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const onChange = (entries: IntersectionObserverEntry[]) => {
      if (entries.length < 1) {
        return
      }

      setEntry(toResultEntry(entries[0]))
    }

    const observer = new IntersectionObserver(onChange, options)

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [options?.root, options?.rootMargin, options?.threshold])

  return { ref, entry }
}

export default useIntersectionObserver
