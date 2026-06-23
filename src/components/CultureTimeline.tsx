import { motion } from 'framer-motion'
import { useState } from 'react'
import { cultureNames, figures } from '../content/article'
import { cultureMedia } from '../content/cultureMedia'
import { FigureCard } from './ImageLightbox'

const quadrant: Record<string, string> = { Luna: 'top-left', Bowie: 'top-right', Arya: 'bottom-left', Loki: 'bottom-right' }

export function CultureTimeline() {
  const [active, setActive] = useState('Luna')
  const selected = cultureNames.find((item) => item.name === active) ?? cultureNames[0]

  return (
    <div className="culture-timeline">
      <div className="culture-tabs" role="group" aria-label="高亮流行文化犬名趋势">
        {cultureNames.map((item) => <button key={item.name} type="button" aria-pressed={active === item.name} onClick={() => setActive(item.name)}><strong>{item.name}</strong><span>{item.year}</span></button>)}
      </div>
      <div className="culture-event" aria-live="polite"><span>{selected.year}</span><strong>{selected.name}</strong><p>{selected.event}</p></div>
      <motion.div
        key={active}
        className="culture-gallery"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        aria-live="polite"
      >
        {cultureMedia[active].map((item) => (
          <figure key={item.src}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            <figcaption>
              <span>{item.caption}</span>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">图片来源</a>
            </figcaption>
          </figure>
        ))}
      </motion.div>
      <div className="trend-figure-wrap">
        <FigureCard figure={figures.cultureTrends} />
        <div className={`trend-spotlight ${quadrant[active]}`} aria-hidden="true" />
      </div>
    </div>
  )
}
