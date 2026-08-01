import { useEffect, useState } from 'react'
import { getRecentFeed } from '../../services/orders'
import { getStyle } from '../../utils/constants'

export default function LiveTicker() {
  const [feed, setFeed] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    getRecentFeed().then((f) => { setFeed(f); setIndex(0) }).catch(() => {})
  }, [])

  useEffect(() => {
    if (feed.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % feed.length), 4000)
    return () => clearInterval(t)
  }, [feed.length])

  if (feed.length === 0) return null

  const item = feed[index]
  const styleName = getStyle(item.style).name
  const waiting = ['propositions_pretes', 'validation_attente'].includes(item.status)
  const text = waiting
    ? `${item.name} découvre ses 3 déclinaisons ${styleName} à ${item.quartier}`
    : `${item.name} a validé son toon ${styleName} à ${item.quartier}`

  return (
    <div style={barStyle} aria-live="polite">
      <span style={liveStyle}>
        <span style={pulseStyle} />
        En direct
      </span>
      <p key={`${index}-${item.name}`} style={textStyle}>
        {waiting ? '⏳' : '✅'} {text}
      </p>
    </div>
  )
}

const barStyle = {
  position: 'relative',
  background: 'rgba(212, 175, 55, 0.06)',
  borderTop: '1px solid rgba(212, 175, 55, 0.15)',
  borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
  padding: '10px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '14px',
  flexWrap: 'wrap',
  overflow: 'hidden',
}

const liveStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: 'var(--gold)',
}

const pulseStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#ef4444',
  animation: 'pulse 1.2s ease-in-out infinite',
}

const textStyle = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--gray-300)',
  animation: 'ticker-in 0.6s ease-out',
  textAlign: 'center',
}
