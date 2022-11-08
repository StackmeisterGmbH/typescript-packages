/**
 * @jest-environment node
 */
import { renderHook } from '@testing-library/react-hooks/server'
import useDocumentVisibility from './useDocumentVisibility'

describe('useDocumentVisibility', () => {
  it('should correctly work in SSR environments', () => {
    const { result } = renderHook(() => useDocumentVisibility())

    expect(result.current).toBe(false)
  })
})
