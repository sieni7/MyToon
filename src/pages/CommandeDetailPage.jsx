import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getOrder, createReorder, isOrderOwner } from '../services/orders'
import { getSessionPhone, isLoggedIn } from '../services/session'
import OrderView from '../components/order/OrderView'

export default function CommandeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [version, setVersion] = useState(0)
  const order = getOrder(id)

  if (!order) {
    return (
      <div className="container" style={wrapStyle}>
        <div style={msgCardStyle}>
          <span style={{ fontSize: '48px' }}>😕</span>
          <h1 style={titleStyle}>Commande introuvable</h1>
          <Link to="/espace/commandes" className="btn btn-primary">Retour à mes commandes</Link>
        </div>
      </div>
    )
  }

  const isOwner = isLoggedIn() && isOrderOwner(order, getSessionPhone())

  const handleReorder = () => {
    const newOrder = createReorder(order)
    navigate(`/espace/commande/${newOrder.id}`)
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={navRowStyle}>
        <Link to="/espace/commandes" style={backLinkStyle}>← Mes commandes</Link>
      </div>

      <OrderView key={version} order={order} full={isOwner} onChanged={() => setVersion((v) => v + 1)} />

      {!isOwner && (
        <div style={lockCardStyle}>
          <span style={{ fontSize: '28px' }}>🔒</span>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.6 }}>
            Cette commande appartient au numéro <strong style={{ color: 'var(--white)' }}>{order.client.telephone}</strong>.
            Connecte-toi avec ce numéro pour voir ta photo, tes déclinaisons et ton adresse.
          </p>
          <Link to="/espace" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13px' }}>
            Me connecter
          </Link>
        </div>
      )}

      {isOwner && order.status === 'livree' && (
        <div style={reorderCardStyle}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)' }}>Tu aimes ton héros ?</p>
            <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Relance une commande avec la même photo et le même style.</p>
          </div>
          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13px' }} onClick={handleReorder}>
            Ré-commander
          </button>
        </div>
      )}
    </div>
  )
}

const wrapStyle = { padding: '120px 0 80px', maxWidth: '720px' }

const navRowStyle = { marginBottom: '20px' }

const backLinkStyle = { fontSize: '14px', color: 'var(--gray-400)', transition: 'color 0.2s' }

const msgCardStyle = {
  background: 'rgba(17,17,17,0.6)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px', padding: '48px', textAlign: 'center',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
}

const titleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const lockCardStyle = {
  marginTop: '20px', display: 'flex', gap: '16px', alignItems: 'center',
  background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '16px', padding: '20px', flexWrap: 'wrap',
}

const reorderCardStyle = {
  marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
  background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)',
  borderRadius: '16px', padding: '20px', flexWrap: 'wrap',
}
