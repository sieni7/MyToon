import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ensureLoggedIn } from '../services/session'
import { listMyOrders } from '../services/orders'
import { getStatus, getStyle, formatPrice } from '../utils/constants'

export default function MesCommandesPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 50

  useEffect(() => {
    let active = true
    ;(async () => {
      await ensureLoggedIn()
      const { orders: list, total: count } = await listMyOrders(0, PAGE_SIZE)
      if (active) {
        setOrders(list)
        setTotal(count)
        setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const loadMore = async () => {
    const next = page + 1
    const { orders: more } = await listMyOrders(next, PAGE_SIZE)
    setOrders((prev) => [...prev, ...more])
    setPage(next)
  }

  const remaining = total - orders.length

  if (loading) {
    return (
      <div className="container" style={wrapStyle}>
        <p style={subStyle}>Chargement…</p>
      </div>
    )
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Mes <span className="gradient-text">commandes</span></h1>
        <p style={subStyle}>{orders.length} commande(s) sur cet appareil</p>
      </div>

      {orders.length === 0 && (
        <div style={emptyCardStyle}>
          <span style={{ fontSize: '48px' }}>🛍️</span>
          <h2 style={{ fontSize: '22px', color: 'var(--white)' }}>Aucune commande</h2>
          <p style={subStyle}>Tu n'as pas encore commandé sur cet appareil.</p>
          <Link to="/commande" className="btn btn-primary">Créer mon toon</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {orders.map((order) => {
          const status = getStatus(order.status)
          return (
            <Link
              key={order.id}
              to={`/espace/commande/${order.code}`}
              style={orderCardStyle}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={orderIdStyle}>{order.code}</span>
                <span style={metaStyle}>
                  {getStyle(order.avatar.style).name} • {order.product.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={statusBadgeStyle}>{status.icon} {status.label}</span>
                <span style={priceStyle}>{formatPrice(order.product.price)}</span>
                <span style={dateStyle}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                <span style={{ color: 'var(--gold)' }}>→</span>
              </div>
            </Link>
          )
        })}
      </div>

      {remaining > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <button className="btn btn-secondary" style={{ padding: '12px 28px' }} onClick={loadMore}>
            Charger plus ({remaining})
          </button>
        </div>
      )}
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
