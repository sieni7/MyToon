import { REFERENCE_PHOTO, ACTIVE_AVATARS, getStyle } from '../../utils/constants'

export default function BeforeAfter() {
  const example = ACTIVE_AVATARS[0]
  const style = getStyle(example.style)

  return (
    <section id="avant-apres" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Ta photo devient un <span className="gradient-text">héros</span>
          </h2>
          <p style={subStyle}>
            C'est simple : tu nous envoies ta photo, nos artistes te préparent 3 déclinaisons de ton toon en 1 heure.
          </p>
        </div>

        <div className="beforeafter-grid" style={gridStyle}>
          <div className="card-gold glass" style={cardStyle}>
            <div style={imgWrapStyle}>
              <img src={REFERENCE_PHOTO} alt="Photo d'origine" style={imgStyle} />
            </div>
            <p style={labelStyle}>1. Ta photo</p>
            <p style={descStyle}>Envoie un selfie ou un portrait net, de face.</p>
          </div>

          <div className="ba-arrow" style={arrowStyle}>➜</div>

          <div className="card-gold glass" style={cardStyle}>
            <div style={{ ...imgWrapStyle, borderColor: `${style.color}55` }}>
              <img src={example.image} alt={example.name} style={imgStyle} />
              <span style={{ ...badgeStyle, background: style.color }}>{style.name}</span>
            </div>
            <p style={labelStyle}>2. Ton toon</p>
            <p style={descStyle}>3 déclinaisons du style choisi, prêtes en 1 heure.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const sectionStyle = { padding: '100px 0', background: 'var(--black)' }

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '48px' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', fontWeight: 700,
  letterSpacing: '-1px', color: 'var(--white)',
}

const subStyle = { fontSize: '16px', color: 'var(--gray-500)', maxWidth: '560px', margin: '0 auto' }

const gridStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '32px', flexWrap: 'wrap',
}

const cardStyle = {
  width: '320px', background: 'rgba(17, 17, 17, 0.6)',
  borderRadius: '20px', border: '1px solid', padding: '16px',
  display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center',
}

const imgWrapStyle = {
  borderRadius: '14px', overflow: 'hidden', position: 'relative',
  border: '1px solid rgba(255,255,255,0.1)',
}

const imgStyle = { width: '100%', aspectRatio: '4/3', objectFit: 'cover' }

const badgeStyle = {
  position: 'absolute', top: '10px', right: '10px',
  color: 'var(--black)', fontSize: '11px', fontWeight: 800,
  padding: '4px 12px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px',
}

const arrowStyle = { fontSize: '40px', color: 'var(--orange)' }

const labelStyle = { fontSize: '18px', fontWeight: 700, color: 'var(--white)' }

const descStyle = { fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6 }
