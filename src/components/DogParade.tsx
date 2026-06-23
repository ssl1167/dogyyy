import { buildDogParadeLanes, type DogCardLayout } from '../data/dogGallery'
import { useReducedMotion } from '../hooks/useReducedMotion'

const lanes = buildDogParadeLanes()

function imageClass(src: string) {
  return src.includes('/gallery/') ? 'is-photo' : 'is-illustration'
}

function ParadeLane({
  cards,
  duration,
}: {
  cards: DogCardLayout[]
  duration: number
}) {
  const sequence = [...cards, ...cards]

  return (
    <div
      className="dog-parade-lane"
      style={{
        ['--parade-duration' as string]: `${duration}s`,
      }}
    >
      <div className="dog-parade-track">
        {sequence.map((card, index) => (
          <figure
            key={`${card.src}-${index}`}
            className={`dog-parade-card ${card.lift ? 'is-lifted' : ''}`}
            style={{
              width: `${card.size}px`,
              transform: `translateY(${card.yOffset}px) rotate(${card.rotate}deg)`,
            }}
          >
            <img src={card.src} alt="" loading="lazy" draggable={false} className={imageClass(card.src)} />
          </figure>
        ))}
      </div>
    </div>
  )
}

export function DogParade() {
  const reduced = useReducedMotion()

  if (reduced) {
    const staticCards = lanes.flatMap((lane) => lane.cards).slice(0, 12)
    return (
      <div className="dog-parade dog-parade-static" aria-label="纽约犬只剪影画廊">
        <div className="dog-parade-intro">
          <p className="visual-label">Central Park Walk</p>
          <p className="dog-parade-lede">154,406 只狗，在同一片草坪上擦肩而过。</p>
        </div>
        <div className="dog-parade-grid">
          {staticCards.map((card) => (
            <figure
              key={card.src}
              className="dog-parade-card"
              style={{
                width: `${card.size}px`,
                transform: `rotate(${card.rotate}deg)`,
              }}
            >
              <img src={card.src} alt="" loading="lazy" draggable={false} className={imageClass(card.src)} />
            </figure>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="dog-parade" aria-label="纽约犬只剪影画廊">
      <div className="dog-parade-intro">
        <p className="visual-label">Central Park Walk</p>
        <p className="dog-parade-lede">154,406 只狗，在同一片草坪上擦肩而过。</p>
      </div>
      <div className="dog-parade-stage">
        <div className="dog-parade-mask" aria-hidden="true" />
        {lanes.map((lane, index) => (
          <ParadeLane
            key={index}
            cards={lane.cards}
            duration={lane.duration}
          />
        ))}
      </div>
    </div>
  )
}
