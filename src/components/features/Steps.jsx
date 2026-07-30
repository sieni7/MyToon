import { STEPS } from '../../utils/constants.js'

export default function Steps() {
  return (
    <section id="steps" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Ton parcours de <span className="gradient-text">héros</span>
          </h2>
          <p style={subStyle}>
            De la photo à ton vêtement. Une transformation en 9 étapes.
          </p>
        </div>

        <div className="steps-grid" style={gridStyle}>
          {STEPS.map((step, i) => (
            <div key={i} style={stepCardStyle}>
              <div style={numStyle}>{step.num}</div>
              <span style={stepIconStyle}>{step.icon}</span>
              <div>
                <p style={stepLabelStyle}>{step.label}</p>
                <p style={stepDescStyle}>{step.desc}</p>
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
  background: 'var(--black)',
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
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px',
}

const stepCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '24px',
  background: 'var(--black-2)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.06)',
  position: 'relative',
  overflow: 'hidden',
}

const numStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--orange)',
  letterSpacing: '2px',
}

const stepIconStyle = {
  fontSize: '28px',
}

const stepLabelStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--white)',
  marginBottom: '4px',
}

const stepDescStyle = {
  fontSize: '13px',
  color: 'var(--gray-500)',
}
