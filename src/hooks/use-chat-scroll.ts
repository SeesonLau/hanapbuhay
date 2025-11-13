import { useCallback, useRef, useEffect } from 'react'

export function useChatScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  // Auto-scroll when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  return { containerRef, scrollToBottom }
}
