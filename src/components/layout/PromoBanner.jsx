import { useState } from 'react'
import { getBanner } from '../../services/banner'

const CLOSE_KEY = 'mytoon_banner_closed'

function isClosed() {
  try {
    return sessionStorage.getItem(CLOSE_KEY) === '1'
  } catch {
    return false
  }
}

export default function PromoBanner() {
  const [closed, setClosed] = useState(isClosed())
  const banner = getBanner()

  if (!banner.active || !banner.text || closed) return null

  return (
    <div style={barStyle}>
      <span style={sparkStyle}>⚡</span>
      <p style={textStyle}>{banner.text}</p>
      <button
        aria-label="Fermer"
        style={closeStyle}
        onClick={() => {
          try { sessionStorage.setItem(CLOSE_KEY, '1') } catch { /* ignore */ }
          setClosed(true)
        }}
      >
        ✕
      </button>
    </div>
  )
}

const barStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  padding: '10px 24px', textAlign: 'center', position: 'relative',
  background: 'linear-gradient(90deg, rgba(255,107,53,0.16), rgba(212,175,55,0.22), rgba(255,107,53,0.16))',
  borderBottom: '1px solid rgba(212,175,55,0.35)',
}

const sparkStyle = { fontSize: '16px' }

const textStyle = {
  fontSize: '14px', fontWeight: 700, color: 'var(--gold-light)', letterSpacing: '0.3px',
  textShadow: '0 0 20px rgba(212,175,55,0.3)',
}

const closeStyle = {
  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: '14px', cursor: 'pointer', padding: '4px',
}
