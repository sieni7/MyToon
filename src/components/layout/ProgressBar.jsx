import { useState, useEffect } from 'react'

const SECTIONS = [
  { id: 'hero', label: 'Accueil', pct: 0 },
  { id: 'upload', label: 'Photo', pct: 25 },
  { id: 'preview-section', label: 'Style', pct: 50 },
  { id: 'values', label: 'Valeurs', pct: 60 },
  { id: 'steps', label: 'Étapes', pct: 75 },
  { id: 'styles', label: 'Styles', pct: 85 },
  { id: 'cta', label: 'Commander', pct: 100 },
]

export default function ProgressBar() {
  const [progress, setProgress] = useState(0)
  const [currentLabel, setCurrentLabel] = useState('Accueil')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(Math.round((scrollY / docHeight) * 100), 100) : 0
      setProgress(pct)

      let label = 'Accueil'
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 2) {
            label = section.label
          }
        }
      }
      setCurrentLabel(label)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={containerStyle}>
      <div style={trackStyle}>
        <div style={{ ...fillStyle, width: `${progress}%` }} />
      </div>
      <span style={labelStyle}>{currentLabel}</span>
    </div>
  )
}

const containerStyle = {
  position: 'fixed',
  top: '72px',
  left: 0,
  right: 0,
  zIndex: 99,
  height: '3px',
  background: 'rgba(255,255,255,0.05)',
  display: 'flex',
  alignItems: 'center',
}

const trackStyle = {
  width: '100%',
  height: '100%',
  background: 'rgba(255,255,255,0.05)',
  position: 'relative',
}

const fillStyle = {
  height: '100%',
  background: 'linear-gradient(90deg, var(--orange), var(--yellow))',
  transition: 'width 0.3s ease',
  position: 'relative',
}

const labelStyle = {
  position: 'absolute',
  right: '16px',
  top: '8px',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
}
