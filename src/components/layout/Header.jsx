import { useState } from 'react'

const navLinks = [
  { label: 'Créer', href: '#hero' },
  { label: 'Styles', href: '#styles' },
  { label: 'Étapes', href: '#steps' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  const handleCta = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header style={headerStyle}>
      <div className="container" style={innerStyle}>
        <a href="/" style={logoStyle}>
          <span style={logoAccent}>M</span>y<span style={logoAccent}>T</span>oon
        </a>

        <nav className="nav-desktop" style={navStyle}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} style={navLinkStyle}>
              {link.label}
            </a>
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
            <a key={link.href} href={link.href} style={mobileLinkStyle} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setOpen(false); handleCta() }}>
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
  background: 'rgba(10,10,10,0.9)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
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
  color: 'var(--gray-400)',
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
  color: 'var(--gray-400)',
  padding: '8px 0',
}
