import type { Calc, SystemTop } from '@stackmeister/unit'
import { createCalculator, createCssSystem } from '@stackmeister/unit'
import type { RefCallback } from 'react'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import useReactiveRef from '@stackmeister/react-use-reactive-ref'
import useMediaQueryMatch from '@stackmeister/react-use-media-query-match'
import { constrained } from '@rwalkling/utils'

const requiredWindowKeys = constrained<ReadonlyArray<keyof Window>>()([
  'devicePixelRatio',
  'document',
  'getComputedStyle',
] as const)

const requiredExtraKeys = ['ResizeObserver']
type Extras = {
  ResizeObserver: typeof ResizeObserver
}

export type RequiredWindowGlobals = Pick<Window, typeof requiredWindowKeys[number]> & Extras
const globals: RequiredWindowGlobals | undefined = [
  ...requiredWindowKeys,
  ...requiredExtraKeys,
].every(key => key in globalThis)
  ? (globalThis as RequiredWindowGlobals)
  : undefined

export type UseCalcOptions = Parameters<typeof createCssSystem>[0]

const extractCssSystem = <ElementType extends HTMLElement>(
  element: ElementType | null,
  pixelRatio: number,
  options: UseCalcOptions,
) => {
  if (element === null || globals === undefined) {
    return createCssSystem(options)
  }

  const {
    document: { documentElement },
    getComputedStyle,
  } = globals

  return createCssSystem({
    pixelRatio,

    viewWidth: documentElement.clientWidth,
    viewHeight: documentElement.clientHeight,
    rootFontSize: parseInt(getComputedStyle(documentElement).fontSize),
    zeroWidth: parseInt(getComputedStyle(documentElement).fontSize),

    fontSize: parseInt(getComputedStyle(element).fontSize),
    width: parseInt(getComputedStyle(element).width, 10),
    height: parseInt(getComputedStyle(element).height, 10),

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

  if (globals === undefined) {
    return { ref, calc }
  }
  const { devicePixelRatio, ResizeObserver } = globals

  // rerender component when pixel ratio changes
  useMediaQueryMatch(`(resolution: ${devicePixelRatio}dppx)`)

  const updateSystem = useCallback(
    () => setSystem(extractCssSystem(inspect.current, devicePixelRatio, options)),
    [inspect.current, devicePixelRatio, options],
  )

  useLayoutEffect(() => {
    const element = inspect.current
    if (element === null) {
      return
    }

    const observer = new ResizeObserver(() => updateSystem())
    observer.observe(element)
    observer.observe(document.documentElement)

    return () => void observer.disconnect()
  }, [inspect.current, updateSystem])

  return { ref, calc }
}

export default useCalc
