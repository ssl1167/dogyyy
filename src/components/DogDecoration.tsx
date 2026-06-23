type DogDecorationProps = {
  name: string
  className?: string
  eager?: boolean
  intensity?: number
}

export function DogDecoration({ name, className = '', eager = false, intensity = 5 }: DogDecorationProps) {
  const animSpeed = 0.6 + intensity * 0.04
  return (
    <div className={className} style={{ animationDuration: `${animSpeed}s` }}>
      <img
        className={`dog-decoration ${className}`}
        src={`/assets/dogs/dog-${name}.png`}
        alt=""
        aria-hidden="true"
        loading={eager ? 'eager' : 'lazy'}
        draggable="false"
      />
    </div>
    
  )
}
