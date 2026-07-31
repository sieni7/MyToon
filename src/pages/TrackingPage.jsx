import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrder, isOrderOwner } from '../services/orders'
import { getSessionPhone, isLoggedIn, login as sessionLogin } from '../services/session'
import OrderView from '../components/order/OrderView'

export default function TrackingPage() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [verifyPhone, setVerifyPhone] = useState('')
  const [verifyError, setVerifyError] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    const found = getOrder(query)
    setOrder(found)
    setNotFound(!found)
    setUnlocked(false)
    setVerifyPhone('')
    setVerifyError(null)
  }

  const isOwnerBySession = order && isLoggedIn() && isOrderOwner(order, getSessionPhone())
  const canViewFull = order && (unlocked || isOwnerBySession)

  const handleVerify = (e) => {
    e.preventDefault()
    if (isOrderOwner(order, verifyPhone)) {
      sessionLogin(verifyPhone)
      setUnlocked(true)
      setVerifyError(null)
    } else {
      setVerifyError('Ce numéro ne correspond pas à la commande. Réessaie avec le numéro utilisé à la commande.')
    }
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Suivre ma <span className="gradient-text">commande</span></h1>
        <p style={subStyle}>Entre ton numéro de commande (ex : MT-0001)</p>
      </div>

      <form onSubmit={handleSearch} style={searchStyle}>
        <input
          style={inputStyle}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="MT-0001"
        />
        <button className="btn btn-primary" type="submit" style={{ padding: '14px 32px' }}>
          Suivre
        </button>
      </form>

      {notFound && !order && (
        <p style={notFoundStyle}>Aucune commande trouvée avec ce numéro. Vérifie ton numéro (ex : MT-0001).</p>
      )}

      {order && (
        <>
          <OrderView order={order} full={canViewFull} />

          {!canViewFull && (
            <div style={privateHintStyle}>
              <span style={{ fontSize: '28px' }}>🔒</span>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)' }}>Vue limitée</p>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                  Ta photo, tes 3 déclinaisons et ton adresse restent privées.
                  {isOwnerBySession
                    ? 'Connecte-toi à ton espace pour tout voir.'
                    : ' Tu as passé cette commande ? Confirme ton numéro pour tout déverrouiller — aucun code à recevoir.'}
                </p>

                {!isOwnerBySession && (
                  <form onSubmit={handleVerify} style={verifyFormStyle}>
                    <input
                      style={verifyInputStyle}
                      value={verifyPhone}
                      onChange={(e) => setVerifyPhone(e.target.value)}
                      placeholder="Ton numéro utilisé à la commande"
                      inputMode="tel"
                    />
                    <button className="btn btn-primary" type="submit" style={{ padding: '12px 20px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      Déverrouiller
                    </button>
                  </form>
                )}
                {verifyError && <p style={verifyErrorStyle}>{verifyError}</p>}
              </div>
              <Link to="/espace" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                Mon espace
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const wrapStyle = { padding: '120px 0 80px', maxWidth: '720px' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '38px', fontWeight: 700,
  letterSpacing: '-1px', color: 'var(--white)',
}

const subStyle = { fontSize: '15px', color: 'var(--gray-500)' }

const searchStyle = { display: 'flex', gap: '12px', marginBottom: '40px' }

const inputStyle = {
  flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-2)', color: 'var(--white)', fontSize: '16px', outline: 'none',
  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: '1px',
}

const notFoundStyle = { textAlign: 'center', color: '#ef4444', fontSize: '14px' }

const privateHintStyle = {
  marginTop: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
  background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '16px', padding: '20px',
}

const verifyFormStyle = { display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }

const verifyInputStyle = {
  flex: 1, minWidth: '200px', padding: '12px 14px', borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)', background: 'var(--black-3)',
  color: 'var(--white)', fontSize: '14px', outline: 'none',
}

const verifyErrorStyle = { marginTop: '8px', color: '#ef4444', fontSize: '12px' }
