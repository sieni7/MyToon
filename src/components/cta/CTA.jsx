import { useNavigate } from 'react-router-dom'

export default function CTA() {
  const navigate = useNavigate()

  return (
    <section id="cta" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div className="cta-card" style={cardStyle}>
          <div style={glowStyle} />
          <span style={sparkleAbsStyle('18px', '16px')}>✦</span>
          <span style={sparkleAbsStyle('auto', 'auto', '20px', '24px')}>✦</span>

          <div className="cta-content" style={contentStyle}>
            <div style={textStyle}>
              <p style={labelStyle}>ABIDJAN STREET WEAR</p>
              <h2 className="cta-title" style={titleStyle}>
                Prêt à devenir un <span style={{ color: 'var(--black)' }}>héros</span> ?
              </h2>
              <p style={subStyle}>
                Ton toon en 1 heure, ton tee-shirt en 48h.
              </p>
            </div>

            <button
              className="btn btn-primary cta-btn"
              style={buttonStyle}
              onClick={() => navigate('/commande')}
            >
              Commander mon toon
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = {
  padding: '80px 0',
  background: 'var(--black-2)',
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const cardStyle = {
  background: 'linear-gradient(120deg, var(--orange) 0%, #ff8a3d 40%, var(--yellow) 100%)',
  borderRadius: '28px',
  padding: '36px 48px',
  maxWidth: '820px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(212, 175, 55, 0.5)',
  boxShadow: '0 0 0 1px rgba(212,175,55,0.08), 0 0 44px rgba(212, 175, 55, 0.12), 0 24px 64px rgba(0,0,0,0.35)',
}

const glowStyle = {
  position: 'absolute',
  top: '-80px',
  right: '-60px',
  width: '260px',
  height: '260px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.28), transparent 70%)',
  pointerEvents: 'none',
}

const contentStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '32px',
  flexWrap: 'wrap',
  position: 'relative',
  zIndex: 1,
}

const textStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left',
  flex: 1,
  minWidth: '240px',
}

const labelStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: 'rgba(0,0,0,0.45)',
  letterSpacing: '3px',
}

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '34px',
  fontWeight: 900,
  color: 'var(--black)',
  letterSpacing: '-1.5px',
  lineHeight: 1.15,
}

const subStyle = {
  fontSize: '14px',
  color: 'rgba(0,0,0,0.65)',
  fontWeight: 500,
}

const buttonStyle = {
  fontSize: '15px',
  padding: '16px 34px',
  background: 'var(--black)',
  color: 'var(--white)',
  border: '1px solid rgba(212, 175, 55, 0.55)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  whiteSpace: 'nowrap',
}

const sparkleAbsStyle = (top = 'auto', right = 'auto', bottom = 'auto', left = 'auto') => ({
  position: 'absolute',
  top,
  right,
  bottom,
  left,
  fontSize: '16px',
  color: 'rgba(0,0,0,0.2)',
  zIndex: 0,
})
