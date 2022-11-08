import { renderHook } from '@testing-library/react-hooks/server'
import useMediaQueryMatch from './useMediaQueryMatch'

describe('useMediaQueryMatch', () => {
  it('should correctly work in SSR environments', () => {
    const { result } = renderHook(() => useMediaQueryMatch('all and (max-width: 100px)'))

    expect(result.current).toBe(false)
  })
})
