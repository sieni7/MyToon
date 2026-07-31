import { useState } from 'react'
import { GALLERY_STYLES } from '../../utils/constants'
import AvatarImage from '../common/AvatarImage'
import StyleLightbox from '../common/StyleLightbox'

export default function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="styles" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Choisis ton <span className="gradient-text">univers</span>
          </h2>
          <p style={subStyle}>
            {GALLERY_STYLES.filter((s) => s.enabled).map((s) => s.name).join(', ')} — chaque style sera décliné en 3 versions de ton propre visage.
          </p>
        </div>

        <div className="gallery-grid" style={gridStyle}>
          {GALLERY_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelected(style)}
              className={`card-gold ${style.enabled ? '' : 'style-disabled'}`}
              style={cardStyle}
            >
              <div style={{ ...previewStyle, background: style.enabled ? style.bg : 'linear-gradient(135deg, #262626, #1a1a1a)' }}>
                {style.avatar ? (
                  <AvatarImage avatar={style.avatar} size="100%" emojiSize={56} style={{ filter: style.enabled ? 'none' : 'grayscale(1)' }} />
                ) : (
                  <span style={{ fontSize: '56px', filter: style.enabled ? 'none' : 'grayscale(1)', opacity: style.enabled ? 1 : 0.5 }}>{style.emoji}</span>
                )}
                {!style.enabled && (
                  <span className="badge-bientot" style={bientotStyle}>⏳ Bientôt</span>
                )}
              </div>

              <div style={infoStyle}>
                <div style={nameRowStyle}>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: style.enabled ? 'var(--white)' : 'var(--gray-500)' }}>{style.name}</p>
                  {style.enabled && <span style={moreStyle}>↗</span>}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.5 }}>{style.desc}</p>
                <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {style.enabled ? 'En savoir plus' : 'Bientôt disponible'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <StyleLightbox style={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

const sectionStyle = { padding: '100px 0', background: 'var(--black-2)' }

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '48px' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', fontWeight: 700,
  letterSpacing: '-1px', color: 'var(--white)',
}

const subStyle = { fontSize: '16px', color: 'var(--gray-500)', maxWidth: '560px', margin: '0 auto' }

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '24px',
}

const cardStyle = {
  display: 'flex', flexDirection: 'column', gap: '14px',
  background: 'rgba(26, 26, 26, 0.6)',
  borderRadius: '20px', overflow: 'hidden', padding: '10px',
  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
  border: '1px solid',
}

const previewStyle = {
  width: '100%', aspectRatio: '1', borderRadius: '14px', overflow: 'hidden',
  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const bientotStyle = { position: 'absolute', top: '10px', right: '10px' }

const infoStyle = { padding: '0 8px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }

const nameRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

const moreStyle = { color: 'var(--gold)', fontSize: '18px' }
