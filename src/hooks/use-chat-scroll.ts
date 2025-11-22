import { useCallback, useRef, useEffect } from 'react'

export function useChatScroll<T = any>(deps: T[] = []) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    })
  }, [])

  // Auto-scroll when dependencies change (e.g., messages array)
  useEffect(() => {
    // Use instant scroll on mount, smooth on updates
    const isFirstRender = deps.length === 0
    scrollToBottom(isFirstRender ? 'instant' : 'smooth')
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { containerRef, scrollToBottom }
}