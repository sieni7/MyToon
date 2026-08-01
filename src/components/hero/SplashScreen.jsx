import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1400)
    const t2 = setTimeout(() => onFinish(), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onFinish])

  return (
    <div data-testid="splash" style={{ ...splashStyle, opacity: leaving ? 0 : 1 }}>
      <div style={innerStyle}>
        <p style={{ ...sublineStyle, animation: 'count-up 0.5s ease-out 0s both' }}>
          ABIDJAN STREET WEAR
        </p>
        <h1 style={{ ...logoStyle, animation: 'count-up 0.5s ease-out 0.12s both' }}>
          <span style={accentStyle}>M</span>y<span style={accentStyle}>T</span>oon
        </h1>
        <div style={{ ...ruleStyle, animation: 'count-up 0.5s ease-out 0.24s both' }} />
        <p style={{ ...taglineStyle, animation: 'count-up 0.5s ease-out 0.34s both' }}>
          Envoie une photo, reçois un <span style={{ color: 'var(--orange)' }}>héros à porter</span>.
        </p>
      </div>
    </div>
  )
}

const splashStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: 'var(--black)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  transition: 'opacity 0.45s ease',
}

const innerStyle = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
}

const sublineStyle = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--orange)',
  letterSpacing: '5px',
}

const logoStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '72px',
  fontWeight: 700,
  letterSpacing: '-2px',
  lineHeight: 1,
  color: 'var(--white)',
  margin: 0,
}

const accentStyle = { color: 'var(--orange)' }

const ruleStyle = {
  width: '48px',
  height: '2px',
  background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
}

const taglineStyle = {
  fontSize: '16px',
  color: 'var(--gray-500)',
  margin: 0,
  maxWidth: '420px',
}
