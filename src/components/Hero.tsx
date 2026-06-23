import { ArrowDown, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { articleMeta } from '../content/article'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { DogDecoration } from './DogDecoration'

const floatingNames = [
  ['Max', 'tag-one'],
  ['Bella', 'tag-two'],
  ['Luna', 'tag-three'],
  ['Charlie', 'tag-four'],
  ['Coco', 'tag-five'],
]

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <header className="hero" id="top">
      <div className="skyline" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, index) => <i key={index} />)}
      </div>
      <div className="hero-copy">
        <p className="eyebrow"><MapPin size={16} aria-hidden="true" /> NEW YORK CITY · DATA STORY</p>
        <motion.h1 initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} aria-label={articleMeta.title}>
          <span>纽约狗名</span><span>大揭秘</span>
        </motion.h1>
        <p className="hero-subtitle">{articleMeta.subtitle}</p>
        <p className="hero-dek">{articleMeta.dek}</p>
      </div>
      <div className="floating-names" aria-hidden="true">
        {floatingNames.map(([name, className], index) => (
          <motion.span
            key={name}
            className={`name-tag ${className}`}
            animate={reduced ? undefined : { y: [0, index % 2 ? -8 : 9, 0], rotate: [0, index % 2 ? 2 : -2, 0] }}
            transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
          >{name}</motion.span>
        ))}
      </div>
      <div className="hero-dogs" aria-hidden="true">
        <DogDecoration name="shiba" className="hero-dog hero-dog-left" eager />
        <DogDecoration name="beagle-jumping" className="hero-dog hero-dog-right" eager />
      </div>
      <a className="scroll-cue" href="#intro">
        <span>从一个名字开始</span>
        <ArrowDown aria-hidden="true" />
      </a>
    </header>
  )
}
