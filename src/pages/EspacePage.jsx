import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ensureLoggedIn, signOut } from '../services/session'
import { isAdmin } from '../services/orders'

export default function EspacePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const user = await ensureLoggedIn()
      const adm = await isAdmin()
      if (active) {
        setConnected(!!user)
        setAdmin(adm)
        setLoading(false)
        if (!user) setError('La session anonyme n\'est pas activée dans Supabase (Auth → Providers → Anonymous).')
      }
    })()
    return () => { active = false }
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>{admin ? '🛡️' : '👤'}</div>
        <h1 style={titleStyle}>Mon <span className="gradient-text">espace</span></h1>

        {loading && <p style={subStyle}>Connexion…</p>}

        {!loading && connected && (
          <>
            <p style={subStyle}>
              {admin
                ? 'Connecté en tant qu\'administrateur MyToon.'
                : 'Connecté sur cet appareil. Retrouve ici tes commandes, ta photo et tes 3 déclinaisons.'}
            </p>
            {!admin && (
              <p style={hintStyle}>
                ℹ️ Pour l\'instant, l\'espace est lié à cet appareil. La connexion par SMS (numéro + code) arrive en Phase B pour retrouver tes commandes sur n\'importe quel appareil.
              </p>
            )}
            <Link to="/espace/commandes" className="btn btn-primary" style={{ width: '100%' }}>
              {admin ? 'Tableau de bord admin' : 'Mes commandes'}
            </Link>
            {admin && (
              <Link to="/admin" className="btn btn-secondary" style={{ width: '100%' }}>
                Tableau de bord
              </Link>
            )}
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
              Se déconnecter
            </button>
          </>
        )}

        {!loading && !connected && (
          <>
            <p style={subStyle}>{error || 'Connexion impossible.'}</p>
            <Link to="/commande" className="btn btn-primary" style={{ width: '100%' }}>
              Créer mon toon
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

const wrapStyle = { padding: '120px 0 80px', maxWidth: '480px' }

const cardStyle = {
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

const hintStyle = {
  fontSize: '12px', color: 'var(--gray-400)', lineHeight: 1.6,
  background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '12px', padding: '12px 14px',
}
