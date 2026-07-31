import { useState, useEffect } from 'react'
import Particles from './Particles'
import { ACTIVE_AVATARS, getStyle } from '../../utils/constants'
import AvatarImage from '../common/AvatarImage'

export default function Hero({ onCtaClick }) {
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [heroCount, setHeroCount] = useState(512)

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex((i) => (i + 1) % ACTIVE_AVATARS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((c) => c + Math.floor(Math.random() * 3) + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const avatar = ACTIVE_AVATARS[avatarIndex]
  const styleTheme = getStyle(avatar.style)

  return (
    <section id="hero" style={sectionStyle}>
      <Particles />
      <div style={overlayStyle} />

      <div className="container" style={containerStyle}>
        <div className="hero-grid" style={gridStyle}>
          <div style={contentStyle}>
            <div style={tagStyle}>
              <span style={dotStyle} />
              Ton toon en 1 heure ⚡
            </div>

            <h1 className="hero-title" style={titleStyle}>
              Le super héros,<br />
              c'est <span className="gradient-text">toi</span>.
            </h1>

            <p className="hero-sub" style={subStyle}>
              Une photo. 3 déclinaisons de toi en 1 heure. Sur ton t-shirt en 48h.
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

            <div className="hero-stats" style={statsStyle}>
              <div style={statStyle}>
                <span style={statNumStyle}>{heroCount}+</span>
                <span style={statLabelStyle}>Héros créés</span>
              </div>
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
                  Héros #{String(avatarIndex + 1).padStart(3, '0')}
                </span>
              </div>

              <div style={{ ...avatarRingStyle, background: `linear-gradient(135deg, ${styleTheme.color}, ${styleTheme.color}88)` }}>
                <AvatarImage avatar={avatar} size="100%" emojiSize={64} style={{ borderRadius: '50%', animation: 'pop 0.5s ease-out' }} />
              </div>

              <div style={heroNameStyle}>{avatar.name}</div>
              <div style={heroIdStyle}>Style {styleTheme.name}</div>

              <div style={styleDotsStyle}>
                {ACTIVE_AVATARS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...dotNavStyle,
                      background: i === avatarIndex ? 'var(--orange)' : 'rgba(255,255,255,0.15)',
                      width: i === avatarIndex ? '20px' : '8px',
                    }}
                  />
                ))}
              </div>

              <div style={badgeStyle}>
                <span style={{ fontSize: '14px' }}>🔥</span>
                En direct
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
  position: 'absolute', inset: 0,
  background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
  pointerEvents: 'none', zIndex: 1,
}

const containerStyle = { position: 'relative', zIndex: 2, width: '100%' }

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }

const contentStyle = { display: 'flex', flexDirection: 'column', gap: '24px' }

const tagStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  fontSize: '13px', fontWeight: 600, color: 'var(--orange)',
  background: 'rgba(255,107,53,0.1)', padding: '8px 16px',
  borderRadius: '100px', width: 'fit-content',
  border: '1px solid rgba(255,107,53,0.2)',
}

const dotStyle = { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '64px', fontWeight: 900,
  lineHeight: 1.05, letterSpacing: '-2px', color: 'var(--white)',
}

const subStyle = { fontSize: '18px', color: 'var(--gray-500)', maxWidth: '440px', lineHeight: 1.7 }

const ctaGroupStyle = { display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }

const statsStyle = { display: 'flex', gap: '40px', marginTop: '16px' }
const statStyle = { display: 'flex', flexDirection: 'column' }
const statNumStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: 'var(--white)' }
const statLabelStyle = { fontSize: '13px', color: 'var(--gray-500)' }

const visualStyle = { display: 'flex', justifyContent: 'center' }

const cardStyle = {
  background: 'linear-gradient(180deg, var(--black-3) 0%, var(--black-2) 100%)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
  padding: '32px', width: '320px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  animation: 'float 4s ease-in-out infinite', position: 'relative',
}

const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }

const avatarRingStyle = {
  width: '150px', height: '150px', borderRadius: '50%',
  padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.5s ease',
}

const heroNameStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '2px', color: 'var(--white)' }

const heroIdStyle = { fontSize: '12px', color: 'var(--gray-500)', letterSpacing: '1px' }

const styleDotsStyle = { display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }

const dotNavStyle = { height: '8px', borderRadius: '100px', transition: 'all 0.3s ease', cursor: 'pointer' }

const badgeStyle = {
  position: 'absolute', top: '-10px', right: '-10px',
  background: 'var(--orange)', color: 'var(--white)',
  padding: '6px 14px', borderRadius: '100px', fontSize: '12px',
  fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px',
}
