import { useEffect, useState } from 'react'
import { ORDER_STATUSES, getStatus, getStyle, formatPrice, AVATARS } from '../utils/constants'
import { listOrders, updateStatus, setVariations, assignPrinter, isAdmin } from '../services/orders'
import { getBanner, setBanner } from '../services/banner'
import { signInAdmin, signOut } from '../lib/supabase'
import SignedImage from '../components/common/SignedImage'
import AvatarImage from '../components/common/AvatarImage'

const QUEUES = [
  { id: 'to_do', label: 'À traiter', icon: '🆕', statuses: ['recue'], hint: 'Nouvelles commandes — crée les 3 déclinaisons' },
  { id: 'creating', label: 'En création', icon: '🎨', statuses: ['en_creation'], hint: 'Création des 3 déclinaisons (1h chrono)' },
  { id: 'validation', label: 'En validation client', icon: '⏳', statuses: ['propositions_pretes', 'validation_attente'], hint: 'Le client choisit sa déclinaison' },
  { id: 'production', label: 'À produire / Livraison', icon: '🖨️', statuses: ['validee', 'en_impression', 'expediee', 'livree'], hint: 'Impression, imprimeur, livraison' },
]

export default function AdminPage() {
  const [status, setStatus] = useState('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      const adm = await isAdmin()
      setStatus(adm ? 'ok' : 'login')
    })()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    const { error: signInError } = await signInAdmin(email, password)
    if (signInError) { setError(signInError); return }
    const adm = await isAdmin()
    if (adm) {
      setStatus('ok')
      setPassword('')
    } else {
      await signOut()
      setError("Ce compte n'est pas un administrateur MyToon.")
    }
  }

  const handleLogout = async () => {
    await signOut()
    setStatus('login')
    setPassword('')
  }

  if (status === 'loading') {
    return (
      <div className="container" style={wrapStyle}>
        <p style={{ color: 'var(--gray-500)' }}>Chargement…</p>
      </div>
    )
  }

  if (status === 'login') {
    return (
      <div className="container" style={wrapStyle}>
        <div style={loginCardStyle}>
          <h1 style={loginTitleStyle}>Dashboard <span className="gradient-text">MyToon</span></h1>
          <p style={loginSubStyle}>Espace réservé — connecte-toi avec ton compte administrateur</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email administrateur"
              autoComplete="email"
            />
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
            />
            {error && <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>}
            <button className="btn btn-primary" type="submit">Accéder</button>
          </form>
          <p style={loginSubStyle}>
            Le compte admin se crée avec le script <code style={{ color: 'var(--gold)' }}>scripts/seed-admin.mjs</code> ou depuis le dashboard Supabase.
          </p>
        </div>
      </div>
    )
  }

  return <Dashboard onLogout={handleLogout} />
}

function Dashboard({ onLogout }) {
  const [version, setVersion] = useState(0)
  const [tab, setTab] = useState('orders')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [banner, setBannerState] = useState({ text: '', active: false })
  const [bannerSaved, setBannerSaved] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      const [list, b] = await Promise.all([listOrders(), getBanner()])
      if (active) {
        setOrders(list)
        setBannerState(b)
        setLoading(false)
      }
    })()
    return () => { active = false }
  }, [version])

  const refresh = () => setVersion((v) => v + 1)

  const saveBanner = async (e) => {
    e.preventDefault()
    await setBanner(banner)
    setBannerSaved(true)
    setTimeout(() => setBannerSaved(false), 2000)
  }

  const inQueue = (o) => QUEUES.find((q) => q.statuses.includes(o.status))
  const filtered = filter === 'all'
    ? orders
    : filter === 'to_do' || filter === 'creating' || filter === 'validation' || filter === 'production'
      ? orders.filter((o) => QUEUES.find((q) => q.id === filter).statuses.includes(o.status))
      : orders.filter((o) => o.status === filter)

  const queueCount = (id) => orders.filter((o) => QUEUES.find((q) => q.id === id).statuses.includes(o.status)).length

  return (
    <div className="container" style={wrapStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Atelier <span className="gradient-text">MyToon</span></h1>
          <p style={subStyle}>{orders.length} commande(s) — suivi du travail en temps réel</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={refresh}>
            Rafraîchir
          </button>
          <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={tabRowStyle}>
        <button style={{ ...tabStyle, color: tab === 'orders' ? 'var(--orange)' : 'var(--gray-400)', borderColor: tab === 'orders' ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.1)' }} onClick={() => setTab('orders')}>
          🛠️ Commandes
        </button>
        <button style={{ ...tabStyle, color: tab === 'settings' ? 'var(--orange)' : 'var(--gray-400)', borderColor: tab === 'settings' ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.1)' }} onClick={() => setTab('settings')}>
          ⚙️ Réglages
        </button>
      </div>

      {tab === 'settings' && (
        <form onSubmit={saveBanner} style={bannerCardStyle}>
          <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={boxTitleStyle}>⚡ Bandeau promo (affiché sur tout le site)</p>
            <input
              style={bannerInputStyle}
              value={banner.text}
              onChange={(e) => setBannerState({ ...banner, text: e.target.value })}
              placeholder="Ex : −10% cette semaine avec le code TOON10"
            />
          </div>
          <label style={toggleStyle}>
            <input
              type="checkbox"
              checked={banner.active}
              onChange={(e) => setBannerState({ ...banner, active: e.target.checked })}
            />
            Actif
          </label>
          <button className="btn btn-primary" type="submit" style={{ padding: '12px 24px', fontSize: '13px' }}>
            {bannerSaved ? '✓ Enregistré' : 'Enregistrer'}
          </button>
        </form>
      )}

      {tab === 'orders' && (
        <>
          <div className="admin-stats" style={statsRowStyle}>
            {QUEUES.map((q) => (
              <button
                key={q.id}
                onClick={() => setFilter(q.id)}
                style={{ ...statCardStyle, cursor: 'pointer', borderColor: filter === q.id ? 'var(--orange)' : 'rgba(255,255,255,0.06)' }}
              >
                <span style={statIconStyle}>{q.icon}</span>
                <span style={statNumStyle}>{queueCount(q.id)}</span>
                <span style={statLabelStyle}>{q.label}</span>
              </button>
            ))}
          </div>

          <div style={filterStyle}>
            <button style={{ ...filterChipStyle, color: filter === 'all' ? 'var(--orange)' : 'var(--gray-400)' }} onClick={() => setFilter('all')}>Toutes</button>
            {QUEUES.map((q) => (
              <button key={q.id} style={{ ...filterChipStyle, color: filter === q.id ? 'var(--orange)' : 'var(--gray-400)' }} onClick={() => setFilter(q.id)}>
                {q.icon} {q.label}
              </button>
            ))}
            {ORDER_STATUSES.map((s) => (
              <button key={s.id} style={{ ...filterChipStyle, color: filter === s.id ? 'var(--orange)' : 'var(--gray-500)' }} onClick={() => setFilter(s.id)}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {loading && <p style={emptyStyle}>Chargement…</p>}
          {!loading && filtered.length === 0 && (
            <p style={emptyStyle}>Aucune commande ici pour le moment.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                queue={inQueue(order)}
                open={expanded === order.id}
                onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
                onChanged={refresh}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function OrderCard({ order, queue, open, onToggle, onChanged }) {
  const [printerId, setPrinterId] = useState(order.printer_id || '')
  const status = getStatus(order.status)
  const avatar = AVATARS.find((a) => a.id === order.avatar?.id)
  const waitingClient = ['propositions_pretes', 'validation_attente'].includes(order.status)
  const canProduce = ['validee', 'en_impression', 'expediee'].includes(order.status)
  const canUpload = ['recue', 'en_creation'].includes(order.status)

  const handleVariations = async (files) => {
    const valid = [...files].filter((f) => f && f.type.startsWith('image/')).slice(0, 3)
    if (valid.length === 0) return
    try {
      await setVariations(order.code, valid)
      onChanged()
    } catch (e) {
      alert(e.message)
    }
  }

  const markCreating = async () => {
    try {
      await updateStatus(order.code, 'en_creation', 'Création commencée')
      onChanged()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleStatus = async () => {
    const next = status.id === 'validee'
      ? 'en_impression'
      : status.id === 'en_impression'
        ? 'expediee'
        : status.id === 'expediee'
          ? 'livree'
          : null
    if (!next) return
    try {
      await updateStatus(order.code, next)
      onChanged()
    } catch (e) {
      alert(e.message)
    }
  }

  const handleAssignPrinter = async () => {
    try {
      await assignPrinter(order.code, printerId.trim())
      onChanged()
    } catch (e) {
      alert(e.message)
    }
  }

  const nextLabel = status.id === 'validee'
    ? 'Passer en impression'
    : status.id === 'en_impression'
      ? 'Passer en expédition'
      : status.id === 'expediee'
        ? 'Marquer comme livrée'
        : null

  return (
    <div style={cardStyle}>
      <button onClick={onToggle} style={cardHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={orderIdStyle}>{order.code}</span>
          <span style={metaStyle}>
            {getStyle(order.avatar.style).name} • {order.product.name} • {formatPrice(order.product.price)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {queue && <span style={queueBadgeStyle}>{queue.icon} {queue.label}</span>}
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
              <p style={boxTextStyle}>
                {order.product.name} — Taille {order.options?.size || '—'} • {order.options?.color || '—'}
              </p>
              <p style={boxTextStyle}>{[order.client.quartier, order.client.ville, order.client.adresse].filter(Boolean).join(', ')}</p>
              {order.printer_id && <p style={{ ...boxTextStyle, color: 'var(--gold)' }}>🖨️ {order.printer_id}</p>}
            </div>
            <div style={boxStyle}>
              <p style={boxTitleStyle}>📷 Photo du client</p>
              {order.photo_path ? <SignedImage path={order.photo_path} style={photoStyle} alt="Photo" /> : <p style={boxTextStyle}>—</p>}
            </div>
            <div style={boxStyle}>
              <p style={boxTitleStyle}>🦸 Avatar de référence (style à recréer)</p>
              {avatar ? (
                <AvatarImage avatar={{ ...avatar, style: order.avatar?.style }} size="110px" />
              ) : (
                <p style={boxTextStyle}>{getStyle(order.avatar?.style).name}</p>
              )}
              <p style={boxTextStyle}>{avatar?.name || getStyle(order.avatar?.style).name}</p>
            </div>
          </div>

          {canUpload && (
            <div style={workboxStyle}>
              <div style={{ flex: 1 }}>
                <p style={boxTitleStyle}>🎨 Création des 3 déclinaisons</p>
                <p style={boxTextStyle}>
                  Re-crée le style {getStyle(order.avatar.style).name} à partir de la photo et de l'avatar de référence,
                  puis dépose les 3 déclinaisons ci-dessous.
                </p>
              </div>
              {status.id === 'recue' && (
                <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={markCreating}>
                  Marquer en création
                </button>
              )}
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
          )}

          {waitingClient && (
            <div style={infoStyle}>
              <p style={{ fontSize: '13px', color: 'var(--yellow)', fontWeight: 600 }}>⏳ En attente de la validation du client</p>
              <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Le client consulte ses 3 déclinaisons et choisit sa préférée. Tu seras notifié dès la validation.</p>
            </div>
          )}

          <div style={boxStyle}>
            <p style={boxTitleStyle}>🎨 Les 3 déclinaisons</p>
            <div style={variationsRowStyle}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={variationSlotStyle}>
                  {order.variations[i] ? (
                    <SignedImage path={order.variations[i]} style={variationImgStyle} alt={`Déclinaison ${i + 1}`} />
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--gray-600)' }}>Vide</span>
                  )}
                  {order.chosen_variation === order.variations[i] && <span style={chosenBadgeStyle}>✓ Choisie</span>}
                </div>
              ))}
            </div>
          </div>

          {canProduce && (
            <div style={workboxStyle}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <p style={boxTitleStyle}>🖨️ Imprimeur partenaire</p>
                <input
                  style={printerInputStyle}
                  value={printerId}
                  onChange={(e) => setPrinterId(e.target.value)}
                  placeholder="Imprimeur partenaire (nom ou id)"
                />
              </div>
              <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={handleAssignPrinter}>
                Assigner
              </button>
            </div>
          )}

          {status.id === 'recue' && (
            <div style={actionRowStyle}>
              <p style={boxTitleStyle}>Statut actuel : {status.label}</p>
            </div>
          )}
          {nextLabel && (
            <div style={actionRowStyle}>
              <p style={boxTitleStyle}>Statut actuel : {status.label}</p>
              <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={handleStatus}>
                {nextLabel}
              </button>
            </div>
          )}

          <div style={boxStyle}>
            <p style={boxTitleStyle}>📜 Timeline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(order.timeline || []).map((t, i) => (
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

const wrapStyle = { padding: '120px 0 80px', maxWidth: '1080px' }

const loginCardStyle = {
  maxWidth: '400px', margin: '0 auto', background: 'var(--black-2)',
  borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center',
}

const loginTitleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const loginSubStyle = { fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6 }

const inputStyle = {
  padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-3)', color: 'var(--white)', fontSize: '15px', outline: 'none', width: '100%',
}

const headerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }

const titleStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--white)' }

const subStyle = { fontSize: '14px', color: 'var(--gray-500)' }

const tabRowStyle = { display: 'flex', gap: '10px', marginBottom: '24px' }

const tabStyle = {
  background: 'none', border: '1px solid', padding: '10px 22px', borderRadius: '100px',
  fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
}

const statsRowStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }

const bannerCardStyle = {
  display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
  background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '16px', padding: '16px 20px',
}

const bannerInputStyle = {
  flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-3)', color: 'var(--white)', fontSize: '14px', outline: 'none',
}

const toggleStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  fontSize: '13px', fontWeight: 600, color: 'var(--gray-400)', cursor: 'pointer',
}

const statCardStyle = {
  background: 'var(--black-2)', borderRadius: '16px', padding: '18px', border: '1px solid',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center',
  fontFamily: 'inherit',
}

const statIconStyle = { fontSize: '22px' }

const statNumStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '26px', fontWeight: 700, color: 'var(--orange)' }

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

const queueBadgeStyle = {
  background: 'rgba(251,191,36,0.12)', color: 'var(--yellow)', padding: '6px 14px',
  borderRadius: '100px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
}

const statusBadgeStyle = {
  background: 'rgba(255,107,53,0.12)', color: 'var(--orange)', padding: '6px 14px',
  borderRadius: '100px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
}

const detailStyle = { padding: '0 22px 22px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '18px' }

const gridRowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }

const boxStyle = { background: 'var(--black-3)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }

const workboxStyle = {
  display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
  background: 'rgba(255,107,53,0.05)', border: '1px solid rgba(255,107,53,0.2)',
  borderRadius: '14px', padding: '16px',
}

const infoStyle = {
  display: 'flex', flexDirection: 'column', gap: '6px',
  background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)',
  borderRadius: '14px', padding: '16px',
}

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
  width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-3)', color: 'var(--white)', fontSize: '14px', outline: 'none',
}
