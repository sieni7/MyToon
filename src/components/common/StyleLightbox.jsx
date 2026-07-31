import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AvatarImage from './AvatarImage'

export default function StyleLightbox({ style, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleCta = () => {
    if (!style.enabled) return
    onClose()
    navigate('/commande')
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div className="glass-strong style-lightbox" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Fermer">✕</button>

        <div style={visualStyle}>
          <div style={{ ...visualWrapStyle, background: style.bg, opacity: style.enabled ? 1 : 0.35 }}>
            {style.avatar ? (
              <AvatarImage avatar={style.avatar} size="100%" emojiSize={96} style={{ borderRadius: 20, filter: style.enabled ? 'none' : 'grayscale(1)' }} />
            ) : (
              <span style={{ fontSize: '96px', filter: style.enabled ? 'none' : 'grayscale(1)' }}>{style.emoji}</span>
            )}
          </div>
        </div>

        <div style={infoStyle}>
          <div style={titleRowStyle}>
            <h2 style={titleStyle}>
              {style.emoji} <span style={{ color: style.color }}>{style.name}</span>
            </h2>
            <span style={{ ...badgeStyle, background: style.enabled ? 'rgba(34,197,94,0.14)' : 'rgba(212,175,55,0.14)', color: style.enabled ? '#22c55e' : 'var(--gold-light)', borderColor: style.enabled ? 'rgba(34,197,94,0.35)' : 'rgba(212,175,55,0.4)' }}>
              {style.enabled ? '● Disponible' : '⏳ Bientôt'}
            </span>
          </div>

          <p style={descStyle}>{style.desc}</p>
          <p style={detailsStyle}>{style.details}</p>

          <div style={featuresStyle}>
            {style.particularites.map((p, i) => (
              <span key={i} style={{ ...featureChipStyle, borderColor: `${style.color}44`, color: style.color }}>{p}</span>
            ))}
          </div>

          <div style={metaStyle}>
            <p style={metaItemStyle}><span style={metaLabelStyle}>Origine</span> {style.origine}</p>
            <p style={metaItemStyle}><span style={metaLabelStyle}>Date</span> {style.date}</p>
          </div>

          <button
            className="btn btn-primary"
            disabled={!style.enabled}
            onClick={handleCta}
            style={{ ...ctaStyle, background: style.enabled ? 'linear-gradient(135deg, var(--orange), var(--orange-dark))' : 'rgba(255,255,255,0.08)', color: style.enabled ? 'var(--white)' : 'var(--gray-500)', cursor: style.enabled ? 'pointer' : 'not-allowed' }}
          >
            {style.enabled ? '⚡ Commander ce style' : '🔒 Bientôt disponible'}
          </button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  animation: 'reveal 0.25s ease-out',
}

const modalStyle = {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '1fr 1.1fr',
  maxWidth: '880px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: '28px',
  padding: '36px',
  gap: '32px',
}

const closeBtnStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 2,
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: 'var(--gray-400)',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
}

const visualStyle = { display: 'flex', alignItems: 'center' }

const visualWrapStyle = {
  width: '100%',
  aspectRatio: '1',
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.1)',
}

const infoStyle = { display: 'flex', flexDirection: 'column', gap: '16px' }

const titleRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }

const titleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const badgeStyle = {
  fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px',
  padding: '6px 14px', borderRadius: '100px', border: '1px solid',
}

const descStyle = { fontSize: '16px', fontWeight: 600, color: 'var(--gray-400)' }

const detailsStyle = { fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7 }

const featuresStyle = { display: 'flex', flexWrap: 'wrap', gap: '8px' }

const featureChipStyle = {
  fontSize: '12px', fontWeight: 600, padding: '6px 14px',
  borderRadius: '100px', border: '1px solid', background: 'rgba(255,255,255,0.03)',
}

const metaStyle = {
  display: 'flex', flexDirection: 'column', gap: '8px',
  borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px',
}

const metaItemStyle = { fontSize: '13px', color: 'var(--gray-400)', lineHeight: 1.6 }

const metaLabelStyle = {
  display: 'inline-block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '1.5px', color: 'var(--gray-600)', marginRight: '8px',
}

const ctaStyle = { marginTop: 'auto', fontSize: '15px', padding: '16px 28px' }
