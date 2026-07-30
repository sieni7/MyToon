export default function Hero({ onCtaClick }) {
  return (
    <section id="hero" style={sectionStyle}>
      <div style={overlayStyle} />

      <div className="container" style={containerStyle}>
        <div className="hero-grid" style={gridStyle}>
          <div style={contentStyle}>
            <div style={tagStyle}>
              <span style={dotStyle} />
              Abidjan Street Wear
            </div>

            <h1 className="hero-title" style={titleStyle}>
              Le super héros,<br />
              c'est <span className="gradient-text">toi</span>.
            </h1>

            <p className="hero-sub" style={subStyle}>
              Une photo. Une IA. Ton alter ego. Ton style.
            </p>

            <div className="hero-cta" style={ctaGroupStyle}>
              <button className="btn btn-primary" onClick={onCtaClick} style={{ fontSize: '16px', padding: '18px 44px' }}>
                Créer mon héros
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comment ça marche
              </button>
            </div>

            <div className="hero-stats" style={statsStyle}>
              <div style={statStyle}>
                <span style={statNumStyle}>500+</span>
                <span style={statLabelStyle}>Héros créés</span>
              </div>
              <div style={statStyle}>
                <span style={statNumStyle}>Abidjan</span>
                <span style={statLabelStyle}>Notre ville</span>
              </div>
              <div style={statStyle}>
                <span style={statNumStyle}>7j</span>
                <span style={statLabelStyle}>Livraison</span>
              </div>
            </div>
          </div>

          <div className="hero-mockup" style={visualStyle}>
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={{ color: 'var(--yellow)', fontSize: '20px' }}>✦</span>
                <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Héros #001</span>
              </div>
              <div style={avatarRingStyle}>
                <div style={avatarStyle}>
                  <div style={faceStyle}>
                    <div style={eyesStyle}>
                      <div style={eyeWhiteStyle}>
                        <div style={{ ...eyePupilStyle, left: '8px' }} />
                      </div>
                      <div style={eyeWhiteStyle}>
                        <div style={{ ...eyePupilStyle, left: '8px' }} />
                      </div>
                    </div>
                    <div style={smileStyle} />
                  </div>
                </div>
              </div>
              <div style={heroNameStyle}>HÉROS DU QUOTIDIEN</div>
              <div style={heroIdStyle}>Force · Créativité · Style</div>
              <div style={statsRowStyle}>
                <div style={{ ...statBarStyle, background: 'var(--orange)', width: '92%' }} />
                <div style={{ ...statBarStyle, background: 'var(--yellow)', width: '88%' }} />
                <div style={{ ...statBarStyle, background: 'var(--cyan)', width: '97%' }} />
              </div>
              <div style={badgeStyle}>
                <span style={{ fontSize: '14px' }}>🔥</span>
                Nouveau héros
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  background: 'radial-gradient(ellipse at 70% 50%, rgba(255,107,53,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 20%, rgba(251,191,36,0.05) 0%, transparent 50%), var(--black)',
}

const overlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
  pointerEvents: 'none',
}

const containerStyle = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '64px',
  alignItems: 'center',
}

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}

const tagStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--orange)',
  background: 'rgba(255,107,53,0.1)',
  padding: '8px 16px',
  borderRadius: '100px',
  width: 'fit-content',
  border: '1px solid rgba(255,107,53,0.2)',
}

const dotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: 'var(--orange)',
}

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '64px',
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: '-2px',
  color: 'var(--white)',
}

const subStyle = {
  fontSize: '18px',
  color: 'var(--gray-500)',
  maxWidth: '440px',
  lineHeight: 1.7,
}

const ctaGroupStyle = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  marginTop: '8px',
}

const statsStyle = {
  display: 'flex',
  gap: '40px',
  marginTop: '16px',
}

const statStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const statNumStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--white)',
}

const statLabelStyle = {
  fontSize: '13px',
  color: 'var(--gray-500)',
}

const visualStyle = {
  display: 'flex',
  justifyContent: 'center',
}

const cardStyle = {
  background: 'linear-gradient(180deg, var(--black-3) 0%, var(--black-2) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px',
  padding: '32px',
  width: '320px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  animation: 'float 4s ease-in-out infinite',
  position: 'relative',
}

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}

const avatarRingStyle = {
  width: '160px',
  height: '160px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--orange), var(--yellow))',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const avatarStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--black-4), var(--black-3))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const faceStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
}

const eyesStyle = {
  display: 'flex',
  gap: '20px',
}

const eyeWhiteStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'var(--white)',
  position: 'relative',
  overflow: 'hidden',
}

const eyePupilStyle = {
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  background: 'var(--black)',
  position: 'absolute',
  top: '9px',
}

const smileStyle = {
  width: '40px',
  height: '12px',
  borderBottom: '3px solid var(--white)',
  borderRadius: '0 0 20px 20px',
}

const heroNameStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '2px',
  color: 'var(--white)',
  textAlign: 'center',
}

const heroIdStyle = {
  fontSize: '12px',
  color: 'var(--gray-500)',
  letterSpacing: '1px',
}

const statsRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%',
  marginTop: '8px',
}

const statBarStyle = {
  height: '6px',
  borderRadius: '100px',
}

const badgeStyle = {
  position: 'absolute',
  top: '-10px',
  right: '-10px',
  background: 'var(--orange)',
  color: 'var(--white)',
  padding: '6px 14px',
  borderRadius: '100px',
  fontSize: '12px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}
