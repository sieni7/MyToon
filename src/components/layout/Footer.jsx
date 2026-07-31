import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div className="container" style={innerStyle}>
        <div>
          <Link to="/" style={logoStyle}>
            <span style={{ color: 'var(--orange)' }}>M</span>y<span style={{ color: 'var(--orange)' }}>T</span>oon
          </Link>
          <p style={taglineStyle}>
            <em>"Fièrement conçu à Abidjan, trempé dans l'énergie du macadam."</em>
          </p>
          <div style={socialStyle}>
            <a href="#" style={socialIconStyle} aria-label="WhatsApp">💬</a>
            <a href="#" style={socialIconStyle} aria-label="Instagram">📸</a>
            <a href="#" style={socialIconStyle} aria-label="TikTok">🎵</a>
          </div>
        </div>

        <div style={linksStyle}>
          <div style={colStyle}>
            <h4 style={colTitle}>MyToon</h4>
            <Link to="/" style={linkStyle}>Accueil</Link>
            <Link to="/commande" style={linkStyle}>Commander</Link>
            <Link to="/suivi" style={linkStyle}>Suivi</Link>
            <Link to="/espace" style={linkStyle}>Mon espace</Link>
            <Link to="/admin" style={linkStyle}>Dashboard</Link>
          </div>
          <div style={colStyle}>
            <h4 style={colTitle}>Légal</h4>
            <a href="#" style={linkStyle}>CGV</a>
            <a href="#" style={linkStyle}>Confidentialité</a>
          </div>
          <div style={colStyle}>
            <h4 style={colTitle}>Contact</h4>
            <a href="#" style={linkStyle}>WhatsApp</a>
            <a href="#" style={linkStyle}>Instagram</a>
            <a href="#" style={linkStyle}>TikTok</a>
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
  background: 'var(--black-2)', color: 'var(--gray-500)',
  padding: '48px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)',
}

const innerStyle = {
  display: 'flex', justifyContent: 'space-between', gap: '48px',
  flexWrap: 'wrap', paddingBottom: '32px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const logoStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px',
  fontWeight: 700, color: 'var(--white)', letterSpacing: '-1px',
}

const taglineStyle = {
  marginTop: '12px', fontSize: '13px', maxWidth: '280px',
  lineHeight: 1.7, color: 'var(--gray-400)',
}

const socialStyle = { display: 'flex', gap: '12px', marginTop: '16px' }

const socialIconStyle = {
  fontSize: '20px', opacity: 0.6, transition: 'opacity 0.2s',
}

const linksStyle = { display: 'flex', gap: '48px', flexWrap: 'wrap' }

const colStyle = { display: 'flex', flexDirection: 'column', gap: '10px' }

const colTitle = {
  color: 'var(--gray-400)', fontSize: '12px', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '1.5px',
}

const linkStyle = { fontSize: '14px', color: 'var(--gray-500)', transition: 'color 0.2s' }

const bottomStyle = { padding: '24px', textAlign: 'center' }

const copyStyle = { fontSize: '12px', color: 'var(--gray-600)' }
