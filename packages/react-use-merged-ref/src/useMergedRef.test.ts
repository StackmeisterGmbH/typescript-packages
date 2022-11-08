import { act, renderHook } from '@testing-library/react-hooks/server'
import { useRef } from 'react'
import useMergedRef from './useMergedRef'

describe('useCalc', () => {
  it('should correctly work in SSR environments', () => {
    const testInstance = {}
    const { result } = renderHook(() => {
      const ref1 = useRef<typeof testInstance>(null)
      const ref2 = useRef<typeof testInstance>(null)
      const mergedRef = useMergedRef(ref1, ref2)
      return { ref1, ref2, mergedRef }
    })

    act(() => {
      result.current.mergedRef(testInstance)
    })

    expect(result.current.ref1.current).toBe(testInstance)
    expect(result.current.ref2.current).toBe(testInstance)
  })
})
