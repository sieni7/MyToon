import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('lightning')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 600)
    const t2 = setTimeout(() => setPhase('done'), 2800)
    const t3 = setTimeout(() => onFinish(), 3600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onFinish])

  return (
    <div style={splashStyle}>
      {phase === 'lightning' && (
        <div style={lightningContainerStyle}>
          <div style={lightningStyle} />
        </div>
      )}

      {(phase === 'text' || phase === 'done') && (
        <div style={textContainerStyle}>
          <p style={sublineStyle}>ABIDJAN STREET WEAR</p>
          <h1 style={heroTextStyle}>
            {phase === 'text' ? (
              <span style={typewriterWrapStyle}>
                <span style={typewriterStyle}>
                  Le super héros,<br />c'est toi.
                </span>
              </span>
            ) : (
              <span style={heroRevealStyle}>
                Le super héros,<br />c'est toi.
              </span>
            )}
          </h1>
          {phase === 'done' && (
            <p style={fadeInSubStyle}>Une photo. 3 déclinaisons en 1h. Sur ton t-shirt en 48h.</p>
          )}
        </div>
      )}

      <div style={cornerTLStyle} />
      <div style={cornerTRStyle} />
      <div style={cornerBLStyle} />
      <div style={cornerBRStyle} />
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
}

const lightningContainerStyle = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const lightningStyle = {
  width: '4px',
  height: '100vh',
  background: 'linear-gradient(180deg, transparent, var(--orange), var(--yellow), var(--orange), transparent)',
  animation: 'lightning-flash 0.6s ease-out',
  boxShadow: '0 0 100px rgba(255,107,53,0.8), 0 0 200px rgba(251,191,36,0.4)',
}

const textContainerStyle = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  animation: 'reveal 0.8s ease-out',
}

const sublineStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--orange)',
  letterSpacing: '4px',
  marginBottom: '8px',
}

const heroTextStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '56px',
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: '-2px',
  color: 'var(--white)',
}

const typewriterWrapStyle = {
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}

const typewriterStyle = {
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  animation: 'typewriter 1.5s steps(25) forwards',
  borderRight: '3px solid var(--orange)',
}

const heroRevealStyle = {
  animation: 'count-up 0.5s ease-out forwards',
}

const fadeInSubStyle = {
  fontSize: '18px',
  color: 'var(--gray-500)',
  animation: 'slide-up 0.6s ease-out forwards',
  opacity: 0,
}

const cornerTLStyle = {
  position: 'absolute', top: 0, left: 0,
  width: '80px', height: '80px',
  borderTop: '2px solid rgba(255,107,53,0.15)',
  borderLeft: '2px solid rgba(255,107,53,0.15)',
}

const cornerTRStyle = {
  position: 'absolute', top: 0, right: 0,
  width: '80px', height: '80px',
  borderTop: '2px solid rgba(255,107,53,0.15)',
  borderRight: '2px solid rgba(255,107,53,0.15)',
}

const cornerBLStyle = {
  position: 'absolute', bottom: 0, left: 0,
  width: '80px', height: '80px',
  borderBottom: '2px solid rgba(255,107,53,0.15)',
  borderLeft: '2px solid rgba(255,107,53,0.15)',
}

const cornerBRStyle = {
  position: 'absolute', bottom: 0, right: 0,
  width: '80px', height: '80px',
  borderBottom: '2px solid rgba(255,107,53,0.15)',
  borderRight: '2px solid rgba(255,107,53,0.15)',
}
