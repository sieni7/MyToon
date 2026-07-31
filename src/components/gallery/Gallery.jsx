import { ACTIVE_AVATARS, ACTIVE_STYLES, getStyle } from '../../utils/constants'
import AvatarImage from '../common/AvatarImage'

export default function Gallery() {
  return (
    <section id="styles" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Choisis ton <span className="gradient-text">univers</span>
          </h2>
          <p style={subStyle}>
            {ACTIVE_STYLES.map((s) => s.name).join(', ')} — chaque style sera décliné en 3 versions de ton propre visage.
          </p>
        </div>

        <div className="gallery-grid" style={gridStyle}>
          {ACTIVE_AVATARS.map((avatar) => {
            const style = getStyle(avatar.style)
            return (
              <div key={avatar.id} style={cardStyle}>
                <AvatarImage avatar={avatar} size="100%" emojiSize={56} />
                <div style={infoStyle}>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--white)' }}>{style.name}</p>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: style.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {avatar.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '20px',
}

const cardStyle = {
  display: 'flex', flexDirection: 'column', gap: '14px',
  background: 'var(--black-3)', borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '10px',
}

const infoStyle = {
  padding: '0 8px 8px', display: 'flex', flexDirection: 'column', gap: '2px',
}
