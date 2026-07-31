import { Link } from 'react-router-dom'
import { getSessionPhone, isLoggedIn } from '../services/session'
import { listOrdersByPhone } from '../services/orders'
import { getStatus, getStyle, formatPrice } from '../utils/constants'

export default function MesCommandesPage() {
  if (!isLoggedIn()) {
    return (
      <div className="container" style={wrapStyle}>
        <div style={emptyCardStyle}>
          <span style={{ fontSize: '48px' }}>🔒</span>
          <h1 style={titleStyle}>Connecte-toi d'abord</h1>
          <p style={subStyle}>Identifie-toi avec ton numéro pour voir tes commandes.</p>
          <Link to="/espace" className="btn btn-primary">Me connecter</Link>
        </div>
      </div>
    )
  }

  const orders = listOrdersByPhone(getSessionPhone())

  return (
    <div className="container" style={wrapStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Mes <span className="gradient-text">commandes</span></h1>
        <p style={subStyle}>{orders.length} commande(s) • {getSessionPhone()}</p>
      </div>

      {orders.length === 0 && (
        <div style={emptyCardStyle}>
          <span style={{ fontSize: '48px' }}>🛍️</span>
          <h2 style={{ fontSize: '22px', color: 'var(--white)' }}>Aucune commande</h2>
          <p style={subStyle}>Tu n'as pas encore commandé avec ce numéro.</p>
          <Link to="/commande" className="btn btn-primary">Créer mon toon</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {orders.map((order) => {
          const status = getStatus(order.status)
          return (
            <Link
              key={order.id}
              to={`/espace/commande/${order.id}`}
              style={orderCardStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={orderIdStyle}>{order.id}</span>
                <span style={metaStyle}>
                  {getStyle(order.avatar.style).name} • {order.product.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={statusBadgeStyle}>{status.icon} {status.label}</span>
                <span style={priceStyle}>{formatPrice(order.product.price)}</span>
                <span style={dateStyle}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                <span style={{ color: 'var(--gold)' }}>→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const wrapStyle = { padding: '120px 0 80px', maxWidth: '720px' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }

const titleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const subStyle = { fontSize: '14px', color: 'var(--gray-500)' }

const emptyCardStyle = {
  background: 'rgba(17,17,17,0.6)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px', padding: '48px', textAlign: 'center',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
}

const orderCardStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
  background: 'rgba(17,17,17,0.6)', border: '1px solid rgba(212,175,55,0.18)',
  borderRadius: '16px', padding: '18px 22px',
  boxShadow: '0 0 20px rgba(212,175,55,0.04)',
  transition: 'all 0.2s',
}

const orderIdStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--white)' }

const metaStyle = { fontSize: '13px', color: 'var(--gray-500)' }

const statusBadgeStyle = {
  background: 'rgba(255,107,53,0.12)', color: 'var(--orange)',
  padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
}

const priceStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--gold)' }

const dateStyle = { fontSize: '12px', color: 'var(--gray-600)' }
