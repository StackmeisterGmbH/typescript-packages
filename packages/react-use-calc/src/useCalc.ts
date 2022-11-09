import type { Calc, SystemTop } from '@stackmeister/unit'
import type { RefCallback } from 'react'
import { createCalculator, createCssSystem } from '@stackmeister/unit'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import useReactiveRef from '@stackmeister/react-use-reactive-ref'
import useMediaQueryMatch from '@stackmeister/react-use-media-query-match'

export type UseCalcOptions = Parameters<typeof createCssSystem>[0]

const extractCssSystem = <ElementType extends HTMLElement>(
  element: ElementType | null,
  pixelRatio: number,
  options: UseCalcOptions,
) => {
  if (element === null) {
    return createCssSystem(options)
  }

  const documentElement = globalThis.document?.documentElement
  const getComputedStyle = globalThis.getComputedStyle
  const documentElementStyle = getComputedStyle?.(documentElement)
  const elementStyle = getComputedStyle?.(element)

  return createCssSystem({
    pixelRatio,

    viewWidth: documentElement?.clientWidth,
    viewHeight: documentElement?.clientHeight,
    rootFontSize: documentElementStyle ? parseInt(documentElementStyle.fontSize, 10) : undefined,
    zeroWidth: documentElementStyle ? parseInt(documentElementStyle.fontSize, 10) : undefined,

    fontSize: elementStyle ? parseInt(elementStyle.fontSize, 10) : undefined,
    width: elementStyle ? parseInt(elementStyle.width, 10) : undefined,
    height: elementStyle ? parseInt(elementStyle.height, 10) : undefined,

    ...options,
  })
}

type UseCalcReturn<ElementType extends HTMLElement> = {
  readonly ref: RefCallback<ElementType>
  readonly calc: Calc
}

const defaultOptions = {}

const useCalc = <ElementType extends HTMLElement>(
  options: UseCalcOptions = defaultOptions,
): UseCalcReturn<ElementType> => {
  const { ref, inspect } = useReactiveRef<ElementType>(null)
  const [system, setSystem] = useState<SystemTop>(createCssSystem(options))

  const calc = useMemo(() => createCalculator(system), [system])

  // rerender component when pixel ratio changes
  useMediaQueryMatch(`(resolution: ${globalThis.devicePixelRatio ?? 1}dppx)`)

  const updateSystem = useCallback(
    () => setSystem(extractCssSystem(inspect.current, devicePixelRatio, options)),
    [inspect.current, devicePixelRatio, options],
  )

  useLayoutEffect(() => {
    if (!globalThis.ResizeObserver) {
      return
    }
    const element = inspect.current
    if (element === null) {
      return
    }

    const observer = new ResizeObserver(() => updateSystem())
    observer.observe(element)
    observer.observe(document.documentElement)

    return () => {
      observer.disconnect()
    }
  }, [inspect.current, updateSystem])

  return { ref, calc }
}

export default useCalc
