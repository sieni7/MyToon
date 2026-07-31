import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Commander', to: '/commande' },
  { label: 'Suivi', to: '/suivi' },
  { label: 'Mon espace', to: '/espace' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const handleCta = () => {
    setOpen(false)
    navigate('/commande')
  }

  return (
    <header style={headerStyle}>
      <div className="container" style={innerStyle}>
        <Link to="/" style={logoStyle}>
          <span style={logoAccent}>M</span>y<span style={logoAccent}>T</span>oon
        </Link>

        <nav className="nav-desktop" style={navStyle}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({ ...navLinkStyle, color: isActive ? 'var(--orange)' : 'var(--gray-400)' })}
            >
              {link.label}
            </NavLink>
          ))}
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }} onClick={handleCta}>
            Créer mon héros
          </button>
        </nav>

        <button className="hamburger-btn" style={hamburgerStyle} onClick={() => setOpen(!open)} aria-label="Menu">
          <span style={{ ...barStyle, transform: open ? 'rotate(45deg) translate(4px,4px)' : 'none', background: open ? 'var(--orange)' : 'var(--white)' }} />
          <span style={{ ...barStyle, opacity: open ? 0 : 1, background: 'var(--white)' }} />
          <span style={{ ...barStyle, transform: open ? 'rotate(-45deg) translate(4px,-4px)' : 'none', background: open ? 'var(--orange)' : 'var(--white)' }} />
        </button>
      </div>

      {open && (
        <div style={mobileMenuStyle}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({ ...mobileLinkStyle, color: isActive ? 'var(--orange)' : 'var(--gray-400)' })}
            >
              {link.label}
            </NavLink>
          ))}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCta}>
            Créer mon héros
          </button>
        </div>
      )}
    </header>
  )
}

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  background: 'rgba(15, 15, 15, 0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(212, 175, 55, 0.12)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
}

const innerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '72px',
}

const logoStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '-1px',
  color: 'var(--white)',
}

const logoAccent = { color: 'var(--orange)' }

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
}

const navLinkStyle = {
  fontSize: '14px',
  fontWeight: 500,
  transition: 'color 0.2s',
}

const hamburgerStyle = {
  display: 'none',
  flexDirection: 'column',
  gap: '4px',
  background: 'none',
  border: 'none',
  padding: '4px',
}

const barStyle = {
  width: '24px',
  height: '2px',
  transition: 'all 0.3s',
  display: 'block',
  borderRadius: '2px',
}

const mobileMenuStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px 24px 24px',
  background: 'var(--black-2)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const mobileLinkStyle = {
  fontSize: '16px',
  fontWeight: 500,
  padding: '8px 0',
}
