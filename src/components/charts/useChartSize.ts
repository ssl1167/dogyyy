import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Fixed height; when omitted, derived from aspectRatio or minHeight */
  height?: number
  minHeight?: number
  aspectRatio?: number
}

export function useChartSize(options: Options = {}) {
  const { height: fixedHeight, minHeight = 280, aspectRatio } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 800, height: fixedHeight ?? 400 })

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const update = () => {
      const width = Math.max(node.clientWidth, 280)
      const height =
        fixedHeight ??
        (aspectRatio ? Math.max(minHeight, width / aspectRatio) : minHeight)
      setSize({ width, height })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [fixedHeight, minHeight, aspectRatio])

  return { containerRef, width: size.width, height: size.height }
}
