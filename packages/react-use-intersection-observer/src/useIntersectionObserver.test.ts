import { renderHook } from '@testing-library/react-hooks/server'
import useIntersectionObserver from './useIntersectionObserver'

describe('useIntersectionObserver', () => {
  it('should correctly work in SSR environments', () => {
    const { result } = renderHook(() => useIntersectionObserver())

    expect(result.current.ref.current).toBe(null)
    expect(result.current.entry.isIntersecting).toBe(false)
  })
})
