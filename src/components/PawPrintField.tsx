type PawPrint = {
  top: number
  left: number
  size: number
  rotate: number
  opacity: number
}

function createPawPrints(count: number): PawPrint[] {
  let seed = 20240622
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  const edgePosition = () => {
    const side = Math.floor(rand() * 4)
    if (side === 0) return { left: rand() * 12, top: rand() * 100 }
    if (side === 1) return { left: 88 + rand() * 12, top: rand() * 100 }
    if (side === 2) {
      const left = rand() < 0.5 ? rand() * 12 : 88 + rand() * 12
      return { left, top: rand() * 10 }
    }
    const left = rand() < 0.5 ? rand() * 12 : 88 + rand() * 12
    return { left, top: 90 + rand() * 10 }
  }

  return Array.from({ length: count }, () => {
    const { left, top } = edgePosition()
    return {
      top,
      left,
      size: 30 + rand() * 70,
      rotate: -38 + rand() * 76,
      opacity: 0.06 + rand() * 0.07,
    }
  })
}

const pawPrints = createPawPrints(100)

export function PawPrintField() {
  return (
    <div className="paw-print-field" aria-hidden="true">
      {pawPrints.map((print, index) => (
        <img
          key={index}
          className="paw-print"
          src="/assets/paw-print.png"
          alt=""
          draggable={false}
          style={{
            top: `${print.top}%`,
            left: `${print.left}%`,
            width: `${print.size}px`,
            transform: `rotate(${print.rotate}deg)`,
            opacity: print.opacity,
          }}
        />
      ))}
    </div>
  )
}
