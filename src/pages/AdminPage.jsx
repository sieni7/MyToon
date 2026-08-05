import { useEffect, useState } from 'react'
import { ORDER_STATUSES, getStatus, getStyle, formatPrice, priceWithPromo, AVATARS } from '../utils/constants'
import { listOrders, updateStatus, setVariations, assignPrinter, isAdmin } from '../services/orders'
import { getBanner, setBanner } from '../services/banner'
import { listCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../services/campaigns'
import { generatePrintPdf, getPrintPdfUrl, downloadPrintPdf } from '../services/print'
import { signInAdmin, signOut } from '../lib/supabase'
import SignedImage from '../components/common/SignedImage'
import AvatarImage from '../components/common/AvatarImage'

const QUEUES = [
  { id: 'to_do', label: 'À traiter', icon: '🆕', statuses: ['recue'] },
  { id: 'creating', label: 'En création', icon: '🎨', statuses: ['en_creation'] },
  { id: 'validation', label: 'En validation client', icon: '⏳', statuses: ['propositions_pretes'] },
  { id: 'production', label: 'À produire / Livraison', icon: '🖨️', statuses: ['validee', 'en_impression', 'expediee', 'livree'] },
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
        <button style={{ ...tabStyle, color: tab === 'campaigns' ? 'var(--orange)' : 'var(--gray-400)', borderColor: tab === 'campaigns' ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.1)' }} onClick={() => setTab('campaigns')}>
          🎉 Campagnes
        </button>
      </div>

      {tab === 'campaigns' && (
        <CampaignsTab />
      )}

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
  const [error, setError] = useState(null)
  const status = getStatus(order.status)
  const avatar = AVATARS.find((a) => a.id === order.avatar?.id)
  const waitingClient = ['propositions_pretes'].includes(order.status)
  const canProduce = ['validee', 'en_impression', 'expediee'].includes(order.status)
  const canUpload = ['recue', 'en_creation'].includes(order.status)

  const handleVariations = async (files) => {
    const valid = [...files].filter((f) => f && f.type.startsWith('image/')).slice(0, 3)
    if (valid.length === 0) return
    setError(null)
    try {
      await setVariations(order.code, valid)
      onChanged()
    } catch (e) {
      setError(e.message)
    }
  }

  const markCreating = async () => {
    setError(null)
    try {
      await updateStatus(order.code, 'en_creation', 'Création commencée')
      onChanged()
    } catch (e) {
      setError(e.message)
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
    setError(null)
    try {
      await updateStatus(order.code, next)
      onChanged()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleAssignPrinter = async () => {
    setError(null)
    try {
      await assignPrinter(order.code, printerId.trim())
      onChanged()
    } catch (e) {
      setError(e.message)
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
            {getStyle(order.avatar.style).name} • {order.product.name} • {order.promo
              ? <><s style={{ color: 'var(--gray-600)' }}>{formatPrice(order.product.price)}</s> {formatPrice(priceWithPromo(order.product.price, order.promo))} <span style={{ color: 'var(--gold)' }}>(−{order.promo.discount}%)</span></>
              : formatPrice(order.product.price)}
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
          {error && (
            <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>⚠️ {error}</p>
          )}
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

          {order.chosen_variation && (
            <PrintBlock code={order.code} hasPdf={!!order.print_pdf_path} onChanged={onChanged} />
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

function PrintBlock({ code, hasPdf, onChanged }) {
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(hasPdf)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setBusy(true)
    setError(null)
    try {
      await generatePrintPdf(code)
      setReady(true)
      if (onChanged) onChanged()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = async () => {
    try { await downloadPrintPdf(code) } catch (e) { setError(e.message) }
  }

  const handleCopyLink = async () => {
    const url = await getPrintPdfUrl(code)
    if (!url) { setError('PDF introuvable'); return }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = async () => {
    const url = await getPrintPdfUrl(code)
    if (!url) { setError('PDF introuvable'); return }
    window.open(`https://wa.me/?text=${encodeURIComponent(`Dossier d'impression MyToon ${code} — ${url}`)}`, '_blank')
  }

  return (
    <div style={printBoxStyle}>
      <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={boxTitleStyle}>🖨️ Fichier d'impression (PDF A4 / DTF)</p>
        <p style={boxTextStyle}>
          Convertit la déclinaison validée en PDF A4 prêt pour l'imprimeur. Dépose une image haute résolution pour un rendu DTF net.
        </p>
        {error && <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>⚠️ {error}</p>}
      </div>
      {!ready ? (
        <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={handleGenerate} disabled={busy}>
          {busy ? 'Génération…' : 'Générer le PDF A4'}
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '12px' }} onClick={handleDownload}>
            📄 Télécharger
          </button>
          <button className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '12px' }} onClick={handleCopyLink}>
            {copied ? '✓ Copié' : 'Copier le lien'}
          </button>
          <button className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '12px' }} onClick={handleWhatsApp}>
            💬 Envoyer à l'imprimeur
          </button>
        </div>
      )}
    </div>
  )
}

const EMPTY_FORM = {
  name: '', code: '', start_date: '', end_date: '', active: false,
  banner_text: '', accent_color: '#ff6b35', promo_code: '', promo_discount: '',
}

function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function CampaignsTab() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  const refresh = async () => {
    const list = await listCampaigns()
    setCampaigns(list)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  const reset = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError(null)
  }

  const startEdit = (c) => {
    setEditingId(c.id)
    setForm({
      name: c.name, code: c.code, start_date: toLocalInput(c.start_date), end_date: toLocalInput(c.end_date),
      active: c.active, banner_text: c.banner_text || '', accent_color: c.accent_color || '#ff6b35',
      promo_code: c.promo_code || '', promo_discount: c.promo_discount != null ? String(c.promo_discount) : '',
    })
    setError(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        active: form.active,
        banner_text: form.banner_text.trim(),
        accent_color: form.accent_color,
        promo_code: form.promo_code.trim().toUpperCase(),
        promo_discount: form.promo_discount === '' ? null : Math.max(0, Math.min(100, Number(form.promo_discount))),
      }
      if (editingId) {
        await updateCampaign(editingId, payload)
      } else {
        await createCampaign(payload)
      }
      reset()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (c) => {
    await updateCampaign(c.id, { active: !c.active })
    await refresh()
  }

  const handleDelete = async (c) => {
    if (!window.confirm(`Supprimer la campagne « ${c.name} » ?`)) return
    await deleteCampaign(c.id)
    if (editingId === c.id) reset()
    await refresh()
  }

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {loading && <p style={emptyStyle}>Chargement…</p>}

      {!loading && campaigns.length === 0 && (
        <p style={emptyStyle}>Aucune campagne. Crée ta première campagne saisonnière ci-dessous.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {campaigns.map((c) => (
          <div key={c.id} style={campaignCardStyle}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '15px', color: 'var(--white)' }}>{c.name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>code: {c.code}</span>
                {c.promo_code && (
                  <span style={{ ...promoCodeBadgeStyle, borderColor: `${c.accent_color}66`, color: c.accent_color }}>
                    {c.promo_code} −{c.promo_discount}%
                  </span>
                )}
                <span style={{ ...statusDotStyle, background: c.active ? '#22c55e' : 'var(--gray-600)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: c.active ? '#22c55e' : 'var(--gray-500)' }}>
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {c.banner_text && <p style={{ fontSize: '13px', color: 'var(--gray-400)' }}>{c.banner_text}</p>}
              <p style={{ fontSize: '12px', color: 'var(--gray-600)' }}>
                {c.start_date ? new Date(c.start_date).toLocaleDateString('fr-FR') : '—'} → {c.end_date ? new Date(c.end_date).toLocaleDateString('fr-FR') : 'illimitée'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => toggleActive(c)}>
                {c.active ? 'Désactiver' : 'Activer'}
              </button>
              <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => startEdit(c)}>
                Modifier
              </button>
              <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', color: '#ef4444' }} onClick={() => handleDelete(c)}>
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSave} style={campaignFormStyle}>
        <p style={boxTitleStyle}>{editingId ? '✏️ Modifier la campagne' : '➕ Nouvelle campagne'}</p>
        <div style={campaignGridStyle}>
          <label style={campaignFieldStyle}>
            Nom
            <input style={inputStyle} value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Ex : Noël 2026" required />
          </label>
          <label style={campaignFieldStyle}>
            Code (identifiant unique)
            <input style={inputStyle} value={form.code} onChange={(e) => setField('code', e.target.value)} placeholder="Ex : noel-2026" required />
          </label>
          <label style={campaignFieldStyle}>
            Début
            <input type="datetime-local" style={inputStyle} value={form.start_date} onChange={(e) => setField('start_date', e.target.value)} />
          </label>
          <label style={campaignFieldStyle}>
            Fin
            <input type="datetime-local" style={inputStyle} value={form.end_date} onChange={(e) => setField('end_date', e.target.value)} />
          </label>
          <label style={{ ...campaignFieldStyle, gridColumn: '1 / -1' }}>
            Texte du bandeau (affiché sur tout le site)
            <input style={inputStyle} value={form.banner_text} onChange={(e) => setField('banner_text', e.target.value)} placeholder="Ex : 🎄 Noël : -10% avec le code NOEL10" />
          </label>
          <label style={campaignFieldStyle}>
            Code promo
            <input style={{ ...inputStyle, textTransform: 'uppercase' }} value={form.promo_code} onChange={(e) => setField('promo_code', e.target.value)} placeholder="Ex : NOEL10" />
          </label>
          <label style={campaignFieldStyle}>
            Remise (%)
            <input type="number" min="0" max="100" style={inputStyle} value={form.promo_discount} onChange={(e) => setField('promo_discount', e.target.value)} placeholder="Ex : 10" />
          </label>
          <label style={campaignFieldStyle}>
            Couleur d'accent (bandeau)
            <input type="color" style={{ ...inputStyle, padding: '4px', height: '44px' }} value={form.accent_color} onChange={(e) => setField('accent_color', e.target.value)} />
          </label>
          <label style={toggleStyle}>
            <input type="checkbox" checked={form.active} onChange={(e) => setField('active', e.target.checked)} />
            Activer immédiatement
          </label>
        </div>
        {error && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>⚠️ {error}</p>}
        {saved && <p style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>✓ Campagne enregistrée</p>}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" type="submit" disabled={saving} style={{ padding: '12px 24px', fontSize: '13px' }}>
            {saving ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Créer la campagne'}
          </button>
          {editingId && (
            <button className="btn btn-secondary" type="button" style={{ padding: '12px 24px', fontSize: '13px' }} onClick={reset}>
              Annuler
            </button>
          )}
        </div>
      </form>
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

const printBoxStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
  background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.22)',
  borderRadius: '14px', padding: '16px',
}

const campaignCardStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
  background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px', padding: '16px 20px',
}

const promoCodeBadgeStyle = {
  fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid',
}

const statusDotStyle = { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }

const campaignFormStyle = {
  display: 'flex', flexDirection: 'column', gap: '16px',
  background: 'var(--black-2)', border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '16px', padding: '20px',
}

const campaignGridStyle = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
}

const campaignFieldStyle = {
  display: 'flex', flexDirection: 'column', gap: '6px',
  fontSize: '13px', fontWeight: 600, color: 'var(--gray-400)',
}
