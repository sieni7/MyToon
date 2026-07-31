import { Link } from 'react-router-dom'

const PROMISES = [
  { icon: '⚡', label: 'Création en 1h chrono' },
  { icon: '🎨', label: '3 déclinaisons offertes' },
  { icon: '🚚', label: 'Livraison 24-48h à Abidjan' },
  { icon: '💳', label: 'Paiement à la livraison' },
]

const PAYMENTS = [
  { icon: '🌊', label: 'Wave' },
  { icon: '🟠', label: 'Orange Money' },
  { icon: '💙', label: 'MTN MoMo' },
  { icon: '💵', label: 'Cash' },
]

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div className="container footer-promise" style={promiseBarStyle}>
        {PROMISES.map((p) => (
          <div key={p.label} style={promiseItemStyle}>
            <span>{p.icon}</span> {p.label}
          </div>
        ))}
      </div>

      <div className="container footer-inner" style={innerStyle}>
        <div style={brandStyle}>
          <Link to="/" style={logoStyle}>
            <span style={{ color: 'var(--orange)' }}>M</span>y<span style={{ color: 'var(--orange)' }}>T</span>oon
          </Link>
          <p style={taglineStyle}>
            <em>"Fièrement conçu à Abidjan, trempé dans l'énergie du macadam."</em>
          </p>
          <div style={socialStyle}>
            <a href="#" className="footer-social" aria-label="WhatsApp">💬</a>
            <a href="#" className="footer-social" aria-label="Instagram">📸</a>
            <a href="#" className="footer-social" aria-label="TikTok">🎵</a>
          </div>
        </div>

        <div className="footer-links" style={linksStyle}>
          <div style={colStyle}>
            <h4 style={colTitle}>MyToon</h4>
            <Link to="/" className="footer-link">Accueil</Link>
            <Link to="/commande" className="footer-link">Commander</Link>
            <Link to="/suivi" className="footer-link">Suivre ma commande</Link>
            <Link to="/espace" className="footer-link">Mon espace</Link>
          </div>
          <div style={colStyle}>
            <h4 style={colTitle}>Contact</h4>
            <a href="tel:+2250707070707" className="footer-link">📞 +225 07 07 07 07 07</a>
            <a href="#" className="footer-link">💬 WhatsApp</a>
            <a href="mailto:hello@mytoon.ci" className="footer-link">✉️ hello@mytoon.ci</a>
            <p style={mutedStyle}>📍 Abidjan, Côte d'Ivoire</p>
          </div>
          <div style={colStyle}>
            <h4 style={colTitle}>Légal</h4>
            <a href="#" className="footer-link">CGV</a>
            <a href="#" className="footer-link">Confidentialité</a>
            <a href="#" className="footer-link">Livraison &amp; retours</a>
          </div>
        </div>
      </div>

      <div className="container footer-pay" style={payStyle}>
        <p style={payLabelStyle}>Paiement accepté</p>
        {PAYMENTS.map((p) => (
          <span key={p.label} style={payBadgeStyle}>
            <span>{p.icon}</span> {p.label}
          </span>
        ))}
      </div>

      <div className="container footer-bottom" style={bottomStyle}>
        <p style={copyStyle}>&copy; {new Date().getFullYear()} MyToon — Abidjan, Côte d'Ivoire. Tous droits réservés.</p>
        <p style={madeStyle}>Conçu avec <span style={{ color: 'var(--orange)' }}>🔥</span> au pays du toon</p>
      </div>
    </footer>
  )
}

const footerStyle = {
  background: 'linear-gradient(180deg, var(--black-2), var(--black))',
  color: 'var(--gray-500)',
  padding: '0 0 0',
  borderTop: '1px solid rgba(212,175,55,0.15)',
  boxShadow: '0 -20px 60px rgba(212,175,55,0.03)',
}

const promiseBarStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
  padding: '16px 24px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
}

const promiseItemStyle = {
  display: 'flex', alignItems: 'center', gap: '8px',
  fontSize: '13px', fontWeight: 600, color: 'var(--gray-400)',
  whiteSpace: 'nowrap',
}

const innerStyle = {
  display: 'flex', justifyContent: 'space-between', gap: '48px',
  flexWrap: 'wrap', padding: '48px 24px 32px',
}

const brandStyle = { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }

const logoStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '26px',
  fontWeight: 700, color: 'var(--white)', letterSpacing: '-1px',
}

const taglineStyle = {
  fontSize: '13px', maxWidth: '280px',
  lineHeight: 1.7, color: 'var(--gray-400)', borderLeft: '2px solid var(--gold-dim)', paddingLeft: '12px',
}

const socialStyle = { display: 'flex', gap: '10px', marginTop: '4px' }

const linksStyle = { display: 'flex', gap: '56px', flexWrap: 'wrap' }

const colStyle = { display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '120px' }

const colTitle = {
  color: 'var(--gold)', fontSize: '12px', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px',
}

const mutedStyle = { fontSize: '14px', color: 'var(--gray-500)', marginTop: '2px' }

const payStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap',
  padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
}

const payLabelStyle = {
  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px',
  color: 'var(--gray-600)', marginRight: '8px',
}

const payBadgeStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  fontSize: '13px', fontWeight: 600, color: 'var(--gray-400)',
  background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)',
  padding: '8px 16px', borderRadius: '100px',
}

const bottomStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px',
  padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
  flexWrap: 'wrap',
}

const copyStyle = { fontSize: '12px', color: 'var(--gray-600)' }

const madeStyle = { fontSize: '12px', color: 'var(--gray-600)' }
