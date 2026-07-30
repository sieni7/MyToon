import { TESTIMONIALS } from '../../utils/constants'

export default function Testimonials() {
  return (
    <section id="testimonials" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Ils ont révélé leur <span className="gradient-text">héros</span>
          </h2>
          <p style={subStyle}>
            De vrais Abidjanais. De vrais héros.
          </p>
        </div>

        <div className="features-grid" style={gridStyle}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={cardStyle}>
              <div style={avatarCircleStyle}>
                <span style={{ fontSize: '24px' }}>{t.name.charAt(0)}</span>
              </div>
              <div style={starsStyle}>
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p style={textStyle}>"{t.text}"</p>
              <div style={authorStyle}>
                <span style={nameStyle}>{t.name}</span>
                <span style={quartierStyle}>{t.quartier}</span>
              </div>
            </div>
          ))}
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

const subStyle = { fontSize: '16px', color: 'var(--gray-500)' }

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }

const cardStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  padding: '28px 20px', background: 'var(--black-2)',
  borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)',
  textAlign: 'center',
}

const avatarCircleStyle = {
  width: '48px', height: '48px', borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--orange), var(--yellow))',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, fontSize: '18px', color: 'var(--black)',
}

const starsStyle = { fontSize: '16px', color: 'var(--yellow)', letterSpacing: '2px' }

const textStyle = { fontSize: '14px', color: 'var(--gray-400)', lineHeight: 1.6, fontStyle: 'italic' }

const authorStyle = { display: 'flex', flexDirection: 'column', gap: '2px' }

const nameStyle = { fontSize: '14px', fontWeight: 600, color: 'var(--white)' }

const quartierStyle = { fontSize: '12px', color: 'var(--gray-500)' }
