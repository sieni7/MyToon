import { useEffect, useState } from 'react'
import { getBanner } from '../../services/banner'
import { useCampaign } from '../../context/campaign'

const CLOSE_KEY = 'mytoon_banner_closed'

function isClosed() {
  try {
    return sessionStorage.getItem(CLOSE_KEY) === '1'
  } catch {
    return false
  }
}

export default function PromoBanner() {
  const { campaign } = useCampaign()
  const [closed, setClosed] = useState(isClosed())
  const [banner, setBanner] = useState({ text: '', active: false })

  useEffect(() => {
    let active = true
    getBanner().then((b) => { if (active) setBanner(b) }).catch(() => {})
    return () => { active = false }
  }, [])

  const text = campaign?.banner_text || (banner.active && banner.text ? banner.text : '')
  const accent = campaign?.accent_color || 'var(--orange)'

  if (!text || closed) return null

  return (
    <div style={{ ...barStyle, background: `linear-gradient(90deg, ${accent}22, ${accent}40, ${accent}22)`, borderBottom: `1px solid ${accent}66` }}>
      <span style={sparkStyle}>⚡</span>
      <p style={textStyle}>{text}</p>
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
  transition: 'background 0.3s ease',
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