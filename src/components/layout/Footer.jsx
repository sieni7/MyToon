export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div className="container" style={innerStyle}>
        <div>
          <a href="/" style={logoStyle}>
            <span style={{ color: 'var(--orange)' }}>M</span>y<span style={{ color: 'var(--orange)' }}>T</span>oon
          </a>
          <p style={taglineStyle}>Abidjan Street Wear — Le super héros, c'est toi.</p>
        </div>

        <div style={linksStyle}>
          <div style={colStyle}>
            <h4 style={colTitle}>Héros</h4>
            <a href="#hero" style={linkStyle}>Créer</a>
            <a href="#styles" style={linkStyle}>Styles</a>
            <a href="#steps" style={linkStyle}>Étapes</a>
          </div>
          <div style={colStyle}>
            <h4 style={colTitle}>Légal</h4>
            <a href="#" style={linkStyle}>CGV</a>
            <a href="#" style={linkStyle}>Confidentialité</a>
          </div>
          <div style={colStyle}>
            <h4 style={colTitle}>Contact</h4>
            <a href="#" style={linkStyle}>Instagram</a>
            <a href="#" style={linkStyle}>WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="container" style={bottomStyle}>
        <p style={copyStyle}>&copy; {new Date().getFullYear()} MyToon — Abidjan, Côte d'Ivoire</p>
      </div>
    </footer>
  )
}

const footerStyle = {
  background: 'var(--black-2)',
  color: 'var(--gray-500)',
  padding: '48px 0 0',
  borderTop: '1px solid rgba(255,255,255,0.06)',
}

const innerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '48px',
  flexWrap: 'wrap',
  paddingBottom: '32px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const logoStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--white)',
  letterSpacing: '-1px',
}

const taglineStyle = {
  marginTop: '8px',
  fontSize: '13px',
  maxWidth: '240px',
  lineHeight: 1.6,
}

const linksStyle = {
  display: 'flex',
  gap: '48px',
  flexWrap: 'wrap',
}

const colStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}

const colTitle = {
  color: 'var(--gray-400)',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
}

const linkStyle = {
  fontSize: '14px',
  color: 'var(--gray-500)',
  transition: 'color 0.2s',
}

const bottomStyle = {
  padding: '24px',
  textAlign: 'center',
}

const copyStyle = {
  fontSize: '12px',
  color: 'var(--gray-600)',
}
