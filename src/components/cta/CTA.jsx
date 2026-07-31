import { useNavigate } from 'react-router-dom'

export default function CTA() {
  const navigate = useNavigate()

  return (
    <section id="cta" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div className="cta-card" style={cardStyle}>
          <div style={sparkleContainerStyle}>
            <span style={sparkleStyle}>✦</span>
            <span style={sparkleStyle}>✦</span>
            <span style={sparkleStyle}>✦</span>
          </div>

          <p style={labelStyle}>ABIDJAN STREET WEAR</p>

          <h2 className="cta-title" style={titleStyle}>
            Prêt à devenir<br />
            un <span style={{ color: 'var(--black)' }}>héros</span> ?
          </h2>

          <p style={subStyle}>
            Ton toon en 1 heure, ton tee-shirt en 48h.
          </p>

          <button
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '18px 44px', background: 'var(--black)', color: 'var(--white)' }}
            onClick={() => navigate('/commande')}
          >
            Commander mon toon
          </button>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = {
  padding: '100px 0',
  background: 'var(--black-2)',
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const cardStyle = {
  background: 'linear-gradient(135deg, var(--orange), var(--yellow))',
  borderRadius: '32px',
  padding: '72px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  maxWidth: '700px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
}

const sparkleContainerStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '8px',
}

const sparkleStyle = {
  fontSize: '20px',
  color: 'rgba(0,0,0,0.3)',
}

const labelStyle = {
  fontSize: '12px',
  fontWeight: 700,
  color: 'rgba(0,0,0,0.4)',
  letterSpacing: '3px',
}

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '44px',
  fontWeight: 900,
  color: 'var(--black)',
  letterSpacing: '-2px',
  lineHeight: 1.1,
}

const subStyle = {
  fontSize: '16px',
  color: 'rgba(0,0,0,0.6)',
}
