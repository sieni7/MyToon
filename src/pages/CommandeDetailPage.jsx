import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getOrder, createReorder, isAdmin } from '../services/orders'
import { getCurrentUser } from '../lib/supabase'
import OrderView from '../components/order/OrderView'

export default function CommandeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      const [found, user, admin] = await Promise.all([getOrder(id), getCurrentUser(), isAdmin()])
      if (!active) return
      if (!found) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setOrder(found)
      setIsOwner(admin || (user && found.owner_user_id === user.id))
      setLoading(false)
    })()
    return () => { active = false }
  }, [id, version])

  const handleReorder = async () => {
    const newOrder = await createReorder(order)
    navigate(`/espace/commande/${newOrder.code}`)
  }

  if (loading) {
    return (
      <div className="container" style={wrapStyle}>
        <p style={{ color: 'var(--gray-500)' }}>Chargement…</p>
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="container" style={wrapStyle}>
        <div style={msgCardStyle}>
          <span style={{ fontSize: '48px' }}>😕</span>
          <h1 style={titleStyle}>Commande introuvable</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '14px', lineHeight: 1.6 }}>
            Cette commande est introuvable ou privée. Connecte-toi avec l'appareil qui l'a passée.
          </p>
          <Link to="/espace/commandes" className="btn btn-primary">Retour à mes commandes</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={navRowStyle}>
        <Link to="/espace/commandes" style={backLinkStyle}>← Mes commandes</Link>
      </div>

      <OrderView order={order} full={isOwner} onChanged={() => setVersion((v) => v + 1)} />

      {!isOwner && (
        <div style={lockCardStyle}>
          <span style={{ fontSize: '28px' }}>🔒</span>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.6 }}>
            Cette commande est privée. Connecte-toi avec l'appareil qui l'a passée pour voir ta photo, tes déclinaisons et ton adresse.
          </p>
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
