import { JOURNEY } from '../../utils/constants'

export default function Phases() {
  return (
    <section id="steps" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Ton parcours de <span className="gradient-text">héros</span>
          </h2>
          <p style={subStyle}>
            6 étapes. De la photo à ton alter ego, jusqu'au tee-shirt livré.
          </p>
        </div>

        <div style={timelineStyle}>
          {JOURNEY.map((step, i) => (
            <div key={step.num} style={stepCardStyle}>
              <div style={badgeWrapStyle}>
                <div style={badgeStyle}>{step.num}</div>
                {i < JOURNEY.length - 1 && <div style={connectorStyle} />}
              </div>
              <div style={stepIconStyle}>{step.icon}</div>
              <h3 style={stepNameStyle}>{step.title}</h3>
              <p style={stepDescStyle}>{step.desc}</p>
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
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '28px',
}

const stepCardStyle = {
  position: 'relative',
  width: '300px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  padding: '36px 24px', background: 'var(--black-3)',
  borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)',
  textAlign: 'center',
}

const badgeWrapStyle = { position: 'relative', marginBottom: '8px' }

const badgeStyle = {
  width: '48px', height: '48px', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '20px', fontWeight: 800, color: 'var(--white)',
  background: 'linear-gradient(135deg, var(--orange), #ff8a3d)',
  boxShadow: '0 8px 24px rgba(255,107,53,0.35)',
}

const connectorStyle = {
  position: 'absolute',
  top: '23px',
  left: '48px',
  width: '28px',
  borderTop: '2px dashed rgba(255,107,53,0.4)',
}

const stepIconStyle = { fontSize: '34px', lineHeight: 1 }

const stepNameStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '20px', fontWeight: 700, color: 'var(--white)',
}

const stepDescStyle = { fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6 }
