import { useState } from 'react'
import { getOrder } from '../services/orders'
import OrderView from '../components/order/OrderView'
import { getCurrentUser } from '../lib/supabase'
import { isAdmin } from '../services/orders'

export default function TrackingPage() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    const [user, admin] = await Promise.all([getCurrentUser(), isAdmin()])
    const found = await getOrder(query)
    const canView = found && (admin || (user && found.owner_user_id === user.id))
    setOrder(canView ? found : null)
    setNotFound(!canView)
    setLoading(false)
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
          {loading ? '...' : 'Suivre'}
        </button>
      </form>

      {notFound && !order && !loading && (
        <p style={notFoundStyle}>
          Aucune commande trouvée. Vérifie ton numéro (ex : MT-0001). Une commande est privée : tu dois être connecté sur l'appareil qui a passé la commande.
        </p>
      )}

      {order && !loading && (
        <OrderView order={order} full={true} />
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

const notFoundStyle = { textAlign: 'center', color: '#ef4444', fontSize: '14px', lineHeight: 1.6 }
