import { STYLES } from '../../utils/constants.js'

export default function Gallery() {
  return (
    <section id="styles" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Choisis ton <span className="gradient-text">univers</span>
          </h2>
          <p style={subStyle}>
            Manga, Comics, Cartoon, Pop Art ou Sketch — quel héros veux-tu devenir ?
          </p>
        </div>

        <div className="gallery-grid" style={gridStyle}>
          {STYLES.map((style, i) => (
            <div key={i} style={cardStyle}>
              <div style={{
                ...previewStyle,
                background: `linear-gradient(135deg, ${style.color}22, transparent)`,
                borderColor: `${style.color}33`,
              }}>
                <span style={emojiStyle}>{style.emoji}</span>
              </div>
              <div style={infoStyle}>
                <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--white)' }}>{style.name}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.5 }}>{style.desc}</p>
              </div>
            </div>
          ))}
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
  flexDirection: 'column',
  gap: '48px',
}

const headerStyle = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '40px',
  fontWeight: 700,
  letterSpacing: '-1px',
  color: 'var(--white)',
}

const subStyle = {
  fontSize: '16px',
  color: 'var(--gray-500)',
  maxWidth: '500px',
  margin: '0 auto',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '20px',
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  background: 'var(--black-3)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.06)',
  overflow: 'hidden',
}

const previewStyle = {
  width: '100%',
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const emojiStyle = {
  fontSize: '56px',
}

const infoStyle = {
  padding: '0 16px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}
