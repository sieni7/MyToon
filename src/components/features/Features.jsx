const values = [
  {
    icon: '🦸',
    title: 'Individualité',
    desc: 'Chaque personne mérite son propre héros. Pas de modèle, que du sur-mesure.',
  },
  {
    icon: '⚡',
    title: 'IA créative',
    desc: 'L\'intelligence artificielle devient un outil artistique au service de ton image.',
  },
  {
    icon: '🔥',
    title: 'Fierté',
    desc: 'Porter MyToon, c\'est afficher qui tu es vraiment. Ton histoire, ton pouvoir.',
  },
  {
    icon: '🌍',
    title: 'Culture',
    desc: 'Une marque née à Abidjan. Pensée pour l\'Afrique. Ouverte au monde.',
  },
]

export default function Features() {
  return (
    <section id="values" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Les valeurs <span className="gradient-text">MyToon</span>
          </h2>
          <p style={subStyle}>
            Plus qu'un vêtement, une déclaration.
          </p>
        </div>

        <div className="features-grid" style={gridStyle}>
          {values.map((v, i) => (
            <div key={i} style={cardStyle}>
              <span style={iconStyle}>{v.icon}</span>
              <h3 style={cardTitleStyle}>{v.title}</h3>
              <p style={cardDescStyle}>{v.desc}</p>
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '24px',
}

const cardStyle = {
  background: 'var(--black-2)',
  borderRadius: '20px',
  padding: '32px',
  border: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'all 0.3s',
}

const iconStyle = {
  fontSize: '36px',
}

const cardTitleStyle = {
  fontSize: '20px',
  fontWeight: 600,
  color: 'var(--white)',
}

const cardDescStyle = {
  fontSize: '14px',
  color: 'var(--gray-500)',
  lineHeight: 1.7,
}
