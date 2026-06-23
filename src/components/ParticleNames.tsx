import { Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { easeCubicInOut } from 'd3'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Dot = { sx: number; sy: number; tx: number; ty: number; color: string }

const stats = [
  ['154,406', '只注册犬只'],
  ['22,116', '个不同名字'],
  ['6000+', '只叫 Bella 或 Max'],
  ['15%', '主人集中于狭窄起名池'],
  ['89.3%', '名字构成铺在底部的细沙'],
]

function seededRandom(seed: number) {
  const value = Math.sin(seed * 999.91) * 43758.5453
  return value - Math.floor(value)
}

function createDots(width: number, height: number, count: number): Dot[] {
  const groups = [
    { share: 0.17, cx: 0.35, cy: 0.35, rx: 0.17, ry: 0.22, color: '#6c4aa4' },
    { share: 0.16, cx: 0.65, cy: 0.37, rx: 0.16, ry: 0.21, color: '#4d3485' },
    { share: 0.08, cx: 0.50, cy: 0.46, rx: 0.12, ry: 0.16, color: '#397f90' },
  ]
  return Array.from({ length: count }, (_, index) => {
    const r1 = seededRandom(index * 4 + 1)
    const r2 = seededRandom(index * 4 + 2)
    const r3 = seededRandom(index * 4 + 3)
    const r4 = seededRandom(index * 4 + 4)
    let group = null as (typeof groups)[number] | null
    let cursor = r1
    for (const item of groups) {
      if (cursor < item.share) { group = item; break }
      cursor -= item.share
    }
    let tx: number
    let ty: number
    let color: string
    if (group) {
      const angle = r2 * Math.PI * 2
      const radius = Math.sqrt(r3)
      tx = width * (group.cx + Math.cos(angle) * group.rx * radius)
      ty = height * (group.cy + Math.sin(angle) * group.ry * radius)
      color = group.color
    } else {
      tx = width * (0.04 + r2 * 0.92)
      ty = height * (0.74 + r3 * 0.20)
      color = r4 > 0.5 ? '#b7aa8e' : '#cf654b'
    }
    return { sx: r2 * width, sy: -20 - r3 * height, tx, ty, color }
  })
}

export function ParticleNames() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number | null>(null)
  const [released, setReleased] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const parent = canvas.parentElement
    if (!parent) return

    const draw = () => {
      const rect = parent.getBoundingClientRect()
      const width = Math.max(320, rect.width)
      const height = Math.min(650, Math.max(420, width * 0.72))
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const dots = createDots(width, height, width < 600 ? 2600 : 6800)

      const render = (amount: number) => {
        context.clearRect(0, 0, width, height)
        context.fillStyle = '#eee9dd'
        context.fillRect(0, 0, width, height)
        for (const dot of dots) {
          const x = dot.sx + (dot.tx - dot.sx) * amount
          const y = dot.sy + (dot.ty - dot.sy) * amount
          context.fillStyle = dot.color
          context.globalAlpha = 0.72
          context.beginPath()
          context.arc(x, y, width < 600 ? 1.15 : 1.35, 0, Math.PI * 2)
          context.fill()
        }
        context.globalAlpha = 1
      }

      if (!released) { render(0); return }
      if (reduced) { render(1); return }
      const start = performance.now()
      const animate = (now: number) => {
        const elapsed = Math.min(1, (now - start) / 2200)
        render(easeCubicInOut(elapsed))
        if (elapsed < 1) frameRef.current = requestAnimationFrame(animate)
      }
      frameRef.current = requestAnimationFrame(animate)
    }

    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(parent)
    return () => {
      observer.disconnect()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [released, reduced])

  return (
    <div className="particle-visual">
      <div className="particle-toolbar">
        <div>
          <p className="visual-label">DOT DENSITY</p>
        </div>
        <button type="button" onClick={() => setReleased(!released)}>
          {released ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />}
          {released ? '重新散布' : '释放数据'}
        </button>
      </div>
      <div className={`canvas-wrap ${released ? 'is-released' : ''}`}>
        <canvas ref={canvasRef} aria-label="Bella、Max 等热门名字形成高峰，低频名字形成长尾。" />
        {released && <div className="particle-labels" aria-hidden="true"><span>Bella</span><span>Max</span><span>长尾 / 89.3%</span></div>}
      </div>
      <div className="stat-grid" aria-label="第一卷关键数字">
        {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </div>
    </div>
  )
}
