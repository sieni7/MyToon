import { useState } from 'react'
import { ORDER_STATUSES, getStatus, getStyle, formatPrice, ADMIN_PASSCODE } from '../utils/constants'
import { listOrders, updateStatus, setVariations, assignPrinter } from '../services/orders'

const NEXT_STATUS = {}
ORDER_STATUSES.forEach((s, i) => {
  if (i < ORDER_STATUSES.length - 1) NEXT_STATUS[s.id] = ORDER_STATUSES[i + 1].id
})

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [authError, setAuthError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (passcode === ADMIN_PASSCODE) {
      setAuthed(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  if (!authed) {
    return (
      <div className="container" style={wrapStyle}>
        <div style={loginCardStyle}>
          <h1 style={loginTitleStyle}>Dashboard <span className="gradient-text">MyToon</span></h1>
          <p style={loginSubStyle}>Espace réservé — entre le code d'accès</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <input
              type="password"
              style={inputStyle}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Code d'accès"
            />
            {authError && <p style={{ color: '#ef4444', fontSize: '13px' }}>Code incorrect</p>}
            <button className="btn btn-primary" type="submit">Accéder</button>
          </form>
        </div>
      </div>
    )
  }

  return <Dashboard />
}

function Dashboard() {
  const [version, setVersion] = useState(0)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const orders = listOrders()

  const refresh = () => setVersion((v) => v + 1)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const stats = {
    all: orders.length,
    active: orders.filter((o) => !['livree', 'expediee'].includes(o.status)).length,
    waiting: orders.filter((o) => ['en_creation', 'propositions_pretes', 'validation_attente'].includes(o.status)).length,
    done: orders.filter((o) => o.status === 'livree').length,
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Commandes</h1>
          <p style={subStyle}>{orders.length} commande(s) enregistrée(s)</p>
        </div>
        <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={() => { setExpanded(null); setFilter('all'); refresh() }}>
          Rafraîchir
        </button>
      </div>

      <div className="admin-stats" style={statsRowStyle}>
        <div style={statCardStyle}><span style={statNumStyle}>{stats.all}</span><span style={statLabelStyle}>Total</span></div>
        <div style={statCardStyle}><span style={statNumStyle}>{stats.active}</span><span style={statLabelStyle}>En cours</span></div>
        <div style={statCardStyle}><span style={statNumStyle}>{stats.waiting}</span><span style={statLabelStyle}>En création</span></div>
        <div style={statCardStyle}><span style={statNumStyle}>{stats.done}</span><span style={statLabelStyle}>Livrées</span></div>
      </div>

      <div style={filterStyle}>
        <button style={{ ...filterChipStyle, color: filter === 'all' ? 'var(--orange)' : 'var(--gray-400)' }} onClick={() => setFilter('all')}>Toutes</button>
        {ORDER_STATUSES.map((s) => (
          <button key={s.id} style={{ ...filterChipStyle, color: filter === s.id ? 'var(--orange)' : 'var(--gray-400)' }} onClick={() => setFilter(s.id)}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={emptyStyle}>Aucune commande ici pour le moment.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((order) => (
          <OrderCard
            key={order.id + version}
            order={order}
            open={expanded === order.id}
            onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
            onChanged={refresh}
          />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, open, onToggle, onChanged }) {
  const [printerId, setPrinterId] = useState(order.printerId || '')
  const status = getStatus(order.status)
  const next = NEXT_STATUS[order.status]

  const handleVariations = (files) => {
    const valid = files.filter((f) => f && f.type.startsWith('image/')).slice(0, 3)
    const readers = valid.map((f) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(f)
    }))
    Promise.all(readers).then((urls) => {
      setVariations(order.id, urls)
      onChanged()
    })
  }

  const handleAssignPrinter = () => {
    assignPrinter(order.id, printerId.trim())
    onChanged()
  }

  return (
    <div style={cardStyle}>
      <button onClick={onToggle} style={cardHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={orderIdStyle}>{order.id}</span>
          <span style={metaStyle}>
            {getStyle(order.avatar.style).name} • {order.product.name} • {formatPrice(order.product.price)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={statusBadgeStyle}>{status.icon} {status.label}</span>
          <span style={{ color: 'var(--gray-500)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div style={detailStyle}>
          <div className="admin-grid-row" style={gridRowStyle}>
            <div style={boxStyle}>
              <p style={boxTitleStyle}>👤 Client</p>
              <p style={boxTextStyle}><strong>{order.client.nom}</strong></p>
              <p style={boxTextStyle}>{order.client.telephone}</p>
              <p style={boxTextStyle}>{[order.client.quartier, order.client.ville, order.client.adresse].filter(Boolean).join(', ')}</p>
            </div>
            <div style={boxStyle}>
              <p style={boxTitleStyle}>📷 Photo du client</p>
              {order.photoDataUrl && <img src={order.photoDataUrl} alt="Photo" style={photoStyle} />}
            </div>
          </div>

          <div style={actionRowStyle}>
            <p style={boxTitleStyle}>Statut actuel : {status.label}</p>
            {next && (
              <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={() => { updateStatus(order.id, next); onChanged() }}>
                Passer à : {getStatus(next).label}
              </button>
            )}
          </div>

          <div style={boxStyle}>
            <p style={boxTitleStyle}>🎨 Les 3 déclinaisons (à déposer ici)</p>
            <div style={variationsRowStyle}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={variationSlotStyle}>
                  {order.variations[i] ? (
                    <img src={order.variations[i]} alt={`Déclinaison ${i + 1}`} style={variationImgStyle} />
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--gray-600)' }}>Vide</span>
                  )}
                  {order.chosenVariation === order.variations[i] && <span style={chosenBadgeStyle}>✓ Choisie</span>}
                </div>
              ))}
            </div>
            <label style={uploadBtnStyle}>
              Déposer les 3 déclinaisons
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => { handleVariations(e.target.files); e.target.value = '' }}
              />
            </label>
          </div>

          <div style={actionRowStyle}>
            <input
              style={printerInputStyle}
              value={printerId}
              onChange={(e) => setPrinterId(e.target.value)}
              placeholder="Imprimeur partenaire (nom ou id)"
            />
            <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={handleAssignPrinter}>
              Assigner
            </button>
          </div>

          <div style={boxStyle}>
            <p style={boxTitleStyle}>📜 Timeline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {order.timeline.map((t, i) => (
                <p key={i} style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                  {new Date(t.date).toLocaleString('fr-FR')} — {getStatus(t.status).label} {t.note ? `(${t.note})` : ''}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const wrapStyle = { padding: '120px 0 80px', maxWidth: '1000px' }

const loginCardStyle = {
  maxWidth: '400px', margin: '0 auto', background: 'var(--black-2)',
  borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center',
}

const loginTitleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const loginSubStyle = { fontSize: '14px', color: 'var(--gray-500)' }

const inputStyle = {
  padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-3)', color: 'var(--white)', fontSize: '15px', outline: 'none', width: '100%',
}

const headerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }

const titleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const subStyle = { fontSize: '14px', color: 'var(--gray-500)' }

const statsRowStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }

const statCardStyle = {
  background: 'var(--black-2)', borderRadius: '16px', padding: '20px',
  border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
}

const statNumStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--orange)' }

const statLabelStyle = { fontSize: '12px', color: 'var(--gray-500)' }

const filterStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }

const filterChipStyle = {
  background: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px',
  borderRadius: '100px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
}

const emptyStyle = { textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px', padding: '40px 0' }

const cardStyle = {
  background: 'var(--black-2)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden',
}

const cardHeaderStyle = {
  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', gap: '12px', flexWrap: 'wrap',
}

const orderIdStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--white)' }

const metaStyle = { fontSize: '13px', color: 'var(--gray-500)' }

const statusBadgeStyle = {
  background: 'rgba(255,107,53,0.12)', color: 'var(--orange)', padding: '6px 14px',
  borderRadius: '100px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
}

const detailStyle = { padding: '0 22px 22px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '18px' }

const gridRowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

const boxStyle = { background: 'var(--black-3)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }

const boxTitleStyle = { fontSize: '13px', fontWeight: 700, color: 'var(--gray-400)' }

const boxTextStyle = { fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.5 }

const photoStyle = { width: '110px', height: '110px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }

const actionRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }

const variationsRowStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }

const variationSlotStyle = {
  aspectRatio: '1', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.15)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: '6px', overflow: 'hidden', position: 'relative',
}

const variationImgStyle = { width: '100%', height: '100%', objectFit: 'cover' }

const chosenBadgeStyle = {
  position: 'absolute', top: '6px', right: '6px', background: 'var(--yellow)', color: 'var(--black)',
  fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '100px',
}

const uploadBtnStyle = {
  alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  background: 'rgba(255,107,53,0.12)', color: 'var(--orange)', border: '1px solid rgba(255,107,53,0.3)',
}

const printerInputStyle = {
  flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-3)', color: 'var(--white)', fontSize: '14px', outline: 'none',
}
