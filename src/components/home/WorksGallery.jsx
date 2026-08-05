import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { STYLES } from '../../utils/constants'

const worksMap = import.meta.glob('../../assets/works/*.{jpg,jpeg,png,webp}', { query: '?url', import: 'default' })

const decorate = async ([path, loader]) => {
  const src = await loader()
  const file = path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const lower = file.toLowerCase()
  const style = STYLES.find((s) => lower.includes(s.id) || lower.includes(s.name.toLowerCase())) || null
  return {
    src,
    name: file.replace(/[-_]/g, ' '),
    styleName: style ? style.name : null,
  }
}

export default function WorksGallery() {
  const [works, setWorks] = useState([])

  useEffect(() => {
    let active = true
    Promise.all(Object.entries(worksMap).map(decorate))
      .then((list) => { if (active) setWorks(list.sort((a, b) => a.name.localeCompare(b.name))) })
      .catch(() => { if (active) setWorks([]) })
    return () => { active = false }
  }, [])

  if (works.length === 0) return null

  return (
    <section id="realisations" className="section" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Nos <span className="gold-text">réalisations</span>
          </h2>
          <p style={subStyle}>Des Abidjanais transformés en héros. La prochaine photo, c'est la tienne.</p>
        </div>

        <div style={gridStyle}>
          {works.map((w) => (
            <div key={w.name} style={cardStyle} className="card-gold works-card">
              <div style={imgWrapStyle}>
                <img src={w.src} alt={w.name} loading="lazy" style={imgStyle} />
                <span style={badgeStyle}>✓ Livré</span>
                {w.styleName && <span style={styleTagStyle}>{w.styleName}</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={ctaRowStyle}>
          <Link to="/commande" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '15px' }}>
            Devenir le prochain héros →
          </Link>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = { background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.04))' }

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '40px' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }

const titleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const subStyle = { fontSize: '15px', color: 'var(--gray-500)' }

const gridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px',
}

const cardStyle = {
  background: 'var(--black-2)', borderRadius: '20px', padding: '10px', overflow: 'hidden',
  display: 'flex', flexDirection: 'column', gap: '10px',
}

const imgWrapStyle = { position: 'relative', borderRadius: '14px', overflow: 'hidden' }

const imgStyle = { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }

const badgeStyle = {
  position: 'absolute', top: '12px', left: '12px',
  background: 'rgba(17,17,17,0.75)', color: 'var(--gold-light)',
  fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
  padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(212,175,55,0.4)',
  backdropFilter: 'blur(6px)',
}

const styleTagStyle = {
  position: 'absolute', bottom: '12px', right: '12px',
  background: 'rgba(255,107,53,0.85)', color: 'var(--white)',
  fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '100px',
}

const ctaRowStyle = { display: 'flex', justifyContent: 'center' }
