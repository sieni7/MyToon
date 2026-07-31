import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn, login, logout, getSessionPhone, validateCode } from '../services/session'

export default function EspacePage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  if (isLoggedIn()) {
    return (
      <div className="container" style={wrapStyle}>
        <div style={loginCardStyle}>
          <div style={iconStyle}>👤</div>
          <h1 style={titleStyle}>Mon <span className="gradient-text">espace</span></h1>
          <p style={subStyle}>Connecté avec le numéro <strong style={{ color: 'var(--white)' }}>{getSessionPhone()}</strong></p>
          <Link to="/espace/commandes" className="btn btn-primary" style={{ width: '100%' }}>
            Mes commandes
          </Link>
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => { logout(); navigate('/') }}>
            Se déconnecter
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 9) {
      setError('Entre un numéro de téléphone valide (ex : +225 07 07 07 07 07)')
      return
    }
    if (code && !validateCode(code)) {
      setError('Le code doit contenir 4 chiffres')
      return
    }
    login('+' + digits)
    navigate('/espace/commandes')
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={loginCardStyle}>
        <div style={iconStyle}>👤</div>
        <h1 style={titleStyle}>Mon <span className="gradient-text">espace</span></h1>
        <p style={subStyle}>
          Retrouve toutes tes commandes, ta photo et tes 3 déclinaisons. Identifie-toi avec le numéro utilisé pour commander.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Numéro de téléphone (Wave/OM)</label>
            <input
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 07 07 07 07 07"
              inputMode="tel"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Code à 4 chiffres <span style={{ color: 'var(--gray-600)' }}>(optionnel)</span></label>
            <input
              style={inputStyle}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••"
              inputMode="numeric"
              maxLength={4}
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button className="btn btn-primary" type="submit">Accéder à mon espace</button>
        </form>

        <p style={hintStyle}>
          Aucun code requis : ton numéro de téléphone suffit. En production (Phase B), un code réel sera envoyé par SMS pour plus de sécurité.
        </p>
      </div>
    </div>
  )
}

const wrapStyle = { padding: '120px 0 80px', maxWidth: '480px' }

const loginCardStyle = {
  background: 'rgba(17, 17, 17, 0.6)', borderRadius: '24px', padding: '40px',
  border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 0 32px rgba(212,175,55,0.06)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center',
}

const iconStyle = {
  fontSize: '40px', width: '72px', height: '72px', borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--orange), var(--yellow))',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const titleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const subStyle = { fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.7 }

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }

const labelStyle = { fontSize: '12px', fontWeight: 600, color: 'var(--gray-400)' }

const inputStyle = {
  padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-3)', color: 'var(--white)', fontSize: '15px', outline: 'none', width: '100%',
}

const errorStyle = { color: '#ef4444', fontSize: '13px' }

const hintStyle = { fontSize: '12px', color: 'var(--gray-600)', lineHeight: 1.6 }
