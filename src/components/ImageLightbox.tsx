import { X, ZoomIn } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Figure } from '../content/article'
import {
  NameBubbleChart,
  GenderBiasChart,
  BoroughCategoryChart,
  BoroughTop20Chart,
  CultureTrendsChart,
  SizeNameHeatmapChart,
  PhoneticsChart,
  HumanizationChart,
} from './charts'

const chartComponents: Record<string, React.ComponentType> = {
  NameBubbleChart,
  GenderBiasChart,
  BoroughCategoryChart,
  BoroughTop20Chart,
  CultureTrendsChart,
  SizeNameHeatmapChart,
  PhoneticsChart,
  HumanizationChart,
}

type Props = { figure: Figure; onClose: () => void }

export function ImageLightbox({ figure, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const ChartComponent = figure.component && chartComponents[figure.component]

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={figure.caption} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="lightbox-panel">
        <button ref={closeRef} className="lightbox-close" type="button" onClick={onClose}>
          <X aria-hidden="true" /><span className="sr-only">关闭大图</span>
        </button>
        {figure.src ? (
          <img src={figure.src} alt={figure.alt} />
        ) : ChartComponent ? (
          <div className="lightbox-chart"><ChartComponent /></div>
        ) : null}
        <p>{figure.caption}</p>
      </div>
    </div>
  )
}

export function FigureCard({ figure, className = '' }: { figure: Figure; className?: string }) {
  const [open, setOpen] = useState(false)

  const isDynamic = figure.type === 'dynamic'
  const ChartComponent = isDynamic && figure.component && chartComponents[figure.component]

  return (
    <>
      <figure className={`figure-card ${className}${isDynamic ? ' dynamic-figure' : ''}`}>
        {isDynamic && ChartComponent ? (
          <div className="dynamic-chart-container">
            <ChartComponent />
          </div>
        ) : (
          <button type="button" className="figure-open" onClick={() => setOpen(true)} aria-label={`查看大图：${figure.caption}`}>
            <img src={figure.src} alt={figure.alt} loading="lazy" onError={(event) => { event.currentTarget.parentElement?.classList.add('image-error') }} />
            <span className="zoom-label"><ZoomIn aria-hidden="true" /> 查看大图</span>
          </button>
        )}
        <figcaption>{figure.caption}</figcaption>
      </figure>
      {open && <ImageLightbox figure={figure} onClose={() => setOpen(false)} />}
    </>
  )
}
