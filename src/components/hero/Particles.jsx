import { useMemo } from 'react'

export default function Particles() {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 4}s`,
    }))
  }, [])

  return (
    <div style={containerStyle}>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            background: star.size > 2 ? 'var(--orange)' : 'rgba(255,255,255,0.6)',
            animation: `twinkle ${star.duration} ${star.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

const containerStyle = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  zIndex: 0,
}
