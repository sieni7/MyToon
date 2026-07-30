import { PHASES } from '../../utils/constants'

export default function Phases() {
  return (
    <section id="steps" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Ton parcours de <span className="gradient-text">héros</span>
          </h2>
          <p style={subStyle}>
            3 phases. Une transformation. De la photo à ton alter ego.
          </p>
        </div>

        <div style={timelineStyle}>
          {PHASES.map((phase, i) => (
            <div key={i} style={phaseCardStyle}>
              <div style={phaseNumStyle}>{phase.num}</div>
              <div style={phaseIconStyle}>{phase.icon}</div>
              <h3 style={phaseNameStyle}>{phase.name}</h3>
              <p style={phaseDescStyle}>{phase.desc}</p>
              <div style={phaseStepsStyle}>
                {phase.steps.map((step, j) => (
                  <span key={j} style={stepChipStyle}>{step}</span>
                ))}
              </div>
              {i < PHASES.length - 1 && <div style={connectorStyle} />}
            </div>
          ))}
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

const subStyle = { fontSize: '16px', color: 'var(--gray-500)' }

const timelineStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px',
  position: 'relative',
}

const phaseCardStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  padding: '36px 24px', background: 'var(--black-3)',
  borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)',
  position: 'relative', textAlign: 'center',
}

const phaseNumStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '48px', fontWeight: 900,
  color: 'rgba(255,107,53,0.1)',
  position: 'absolute', top: '12px', right: '16px',
  lineHeight: 1,
}

const phaseIconStyle = { fontSize: '40px' }

const phaseNameStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '22px', fontWeight: 700, color: 'var(--white)',
}

const phaseDescStyle = { fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6 }

const phaseStepsStyle = { display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '4px' }

const stepChipStyle = {
  fontSize: '11px', fontWeight: 600, color: 'var(--orange)',
  background: 'rgba(255,107,53,0.1)', padding: '4px 12px',
  borderRadius: '100px',
}

const connectorStyle = {
  display: 'none',
}
