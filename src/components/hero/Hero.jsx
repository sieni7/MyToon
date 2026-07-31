import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Particles from './Particles'
import TeeMockup from './TeeMockup'
import { ACTIVE_AVATARS, ACTIVE_STYLES, REFERENCE_PHOTO, getStyle } from '../../utils/constants'
import { getOrderStats } from '../../services/orders'

const TRUST_BADGES = ['💳 Paiement à la livraison', '3 styles au choix', '📦 Livraison 24-48h']

export default function Hero({ onCtaClick }) {
  const navigate = useNavigate()
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [showPhoto, setShowPhoto] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex((i) => (i + 1) % ACTIVE_AVATARS.length)
      setShowPhoto(false)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    getOrderStats().then((s) => setStats(s)).catch(() => {})
  }, [])

  const avatar = ACTIVE_AVATARS[avatarIndex]
  const styleTheme = getStyle(avatar.style)
  const heroCount = stats ? Number(stats.orders) || 0 : null

  const goStyle = (styleId) => navigate(`/commande?style=${styleId}`)

  return (
    <section id="hero" style={sectionStyle}>
      <Particles />
      <div style={overlayStyle} />

      <div className="container" style={containerStyle}>
        <div className="hero-grid" style={gridStyle}>
          <div style={contentStyle}>
            <div style={tagStyle}>
              <span style={dotStyle} />
              Ta photo → ton héros sur t-shirt, en 1h ⚡
            </div>

            <h1 className="hero-title" style={titleStyle}>
              Envoie une photo, reçois un <span className="gradient-text">héros à porter</span>.
            </h1>

            <p className="hero-sub" style={subStyle}>
              3 déclinaisons de toi en 1 heure, imprimées sur un t-shirt ou un polo 100% coton local — livré en 24-48h.
            </p>

            <div className="hero-cta" style={ctaGroupStyle}>
              <button className="btn-portal" onClick={onCtaClick}>
                🔥 Activer mon pouvoir
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comment ça marche
              </button>
            </div>

            <div className="hero-trust" style={trustRowStyle}>
              {TRUST_BADGES.map((b) => (
                <span key={b} style={trustChipStyle}>{b}</span>
              ))}
            </div>

            <div className="hero-stats" style={statsStyle}>
              {heroCount !== null && heroCount > 0 && (
                <div style={statStyle}>
                  <span style={statNumStyle}>{heroCount}+</span>
                  <span style={statLabelStyle}>Héros créés</span>
                </div>
              )}
              <div style={statStyle}>
                <span style={statNumStyle}>1h</span>
                <span style={statLabelStyle}>Pour ton toon</span>
              </div>
              <div style={statStyle}>
                <span style={statNumStyle}>48h</span>
                <span style={statLabelStyle}>Livraison</span>
              </div>
            </div>
          </div>

          <div className="hero-mockup" style={visualStyle}>
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={{ color: 'var(--yellow)', fontSize: '20px' }}>✦</span>
                <span style={{ fontSize: '12px', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Imprimé sur ton t-shirt
                </span>
              </div>

              <TeeMockup photo={REFERENCE_PHOTO} avatar={avatar} showPhoto={showPhoto} color={styleTheme.color} />

              <div style={toggleRowStyle}>
                <button
                  style={{ ...togglePillStyle, background: showPhoto ? 'var(--orange)' : 'var(--black-3)', color: showPhoto ? 'var(--black)' : 'var(--gray-400)' }}
                  onClick={() => setShowPhoto(true)}
                >
                  📷 Photo
                </button>
                <button
                  style={{ ...togglePillStyle, background: !showPhoto ? 'var(--orange)' : 'var(--black-3)', color: !showPhoto ? 'var(--black)' : 'var(--gray-400)' }}
                  onClick={() => setShowPhoto(false)}
                >
                  🦸 Toon
                </button>
              </div>

              <div style={heroNameStyle}>{avatar.name}</div>
              <div style={heroIdStyle}>Style {styleTheme.name}</div>

              <div style={styleDotsStyle}>
                {ACTIVE_AVATARS.map((a, i) => (
                  <button
                    key={a.id}
                    aria-label={`Voir ${a.name}`}
                    onClick={() => { setAvatarIndex(i); setShowPhoto(false) }}
                    style={{
                      ...dotNavStyle,
                      background: i === avatarIndex ? styleTheme.color : 'rgba(255,255,255,0.15)',
                      width: i === avatarIndex ? '22px' : '8px',
                    }}
                  />
                ))}
              </div>

              <div style={carouselStyle}>
                {ACTIVE_STYLES.map((s) => (
                  <button key={s.id} style={carouselChipStyle} onClick={() => goStyle(s.id)}>
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
              <p style={carouselHintStyle}>Choisis un style pour commander directement 👆</p>
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
  position: 'absolute', inset: 0,
  background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
  pointerEvents: 'none', zIndex: 1,
}

const containerStyle = { position: 'relative', zIndex: 2, width: '100%' }

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }

const contentStyle = { display: 'flex', flexDirection: 'column', gap: '20px' }

const tagStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  fontSize: '13px', fontWeight: 600, color: 'var(--orange)',
  background: 'rgba(255,107,53,0.1)', padding: '8px 16px',
  borderRadius: '100px', width: 'fit-content',
  border: '1px solid rgba(255,107,53,0.2)',
}

const dotStyle = { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '56px', fontWeight: 900,
  lineHeight: 1.08, letterSpacing: '-2px', color: 'var(--white)',
}

const subStyle = { fontSize: '18px', color: 'var(--gray-500)', maxWidth: '460px', lineHeight: 1.7 }

const ctaGroupStyle = { display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }

const trustRowStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap' }

const trustChipStyle = {
  fontSize: '12px', fontWeight: 600, color: 'var(--gray-400)',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  padding: '7px 14px', borderRadius: '100px',
}

const statsStyle = { display: 'flex', gap: '40px', marginTop: '8px' }
const statStyle = { display: 'flex', flexDirection: 'column' }
const statNumStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: 'var(--white)' }
const statLabelStyle = { fontSize: '13px', color: 'var(--gray-500)' }

const visualStyle = { display: 'flex', justifyContent: 'center' }

const cardStyle = {
  background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.6) 0%, rgba(17, 17, 17, 0.6) 100%)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(212, 175, 55, 0.2)',
  boxShadow: '0 0 32px rgba(212, 175, 55, 0.05), 0 20px 60px rgba(0, 0, 0, 0.4)',
  borderRadius: '24px',
  padding: '24px 28px', width: '360px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  animation: 'float 4s ease-in-out infinite', position: 'relative',
}

const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }

const toggleRowStyle = { display: 'flex', gap: '8px', marginTop: '4px' }

const togglePillStyle = {
  padding: '8px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 700,
  border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.2s',
}

const heroNameStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '2px', color: 'var(--white)' }

const heroIdStyle = { fontSize: '12px', color: 'var(--gray-500)', letterSpacing: '1px' }

const styleDotsStyle = { display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }

const dotNavStyle = {
  height: '8px', borderRadius: '100px', transition: 'all 0.3s ease', cursor: 'pointer',
  border: 'none', padding: 0,
}

const carouselStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }

const carouselChipStyle = {
  fontSize: '12px', fontWeight: 700, color: 'var(--gray-300)',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s',
}

const carouselHintStyle = { fontSize: '11px', color: 'var(--gray-600)' }
