import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ACTIVE_STYLES, ACTIVE_AVATARS, PRODUCTS, SIZE_GUIDE, formatPrice, priceWithPromo, getStyle } from '../utils/constants'
import AvatarImage from '../components/common/AvatarImage'
import UploadArea from '../components/upload/UploadArea'
import { useImageUpload } from '../hooks/useImageUpload'
import { compressImageToBlob } from '../utils/image'
import { createOrder } from '../services/orders'
import { validatePromo } from '../services/campaigns'

const STEP_LABELS = ['Avatar', 'Support', 'Photo & infos']

export default function OrderPage() {
  const [searchParams] = useSearchParams()
  const presetStyle = ACTIVE_STYLES.find((s) => s.id === searchParams.get('style'))
  const [step, setStep] = useState(1)
  const [styleId, setStyleId] = useState(presetStyle ? presetStyle.id : ACTIVE_STYLES[0].id)
  const [avatar, setAvatar] = useState(() => {
    if (!presetStyle) return null
    return ACTIVE_AVATARS.find((a) => a.style === presetStyle.id) || null
  })
  const [product, setProduct] = useState(PRODUCTS[0])
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const [form, setForm] = useState({ nom: '', telephone: '', quartier: '', ville: 'Abidjan', adresse: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [order, setOrder] = useState(null)
  const { image, preview, loading: uploadLoading, error: uploadError, handleFile } = useImageUpload()
  const [promo, setPromo] = useState('')
  const [promoInfo, setPromoInfo] = useState(null)
  const [promoError, setPromoError] = useState(null)
  const [promoBusy, setPromoBusy] = useState(false)

  const avatars = ACTIVE_AVATARS.filter((a) => a.style === styleId)
  const selectedStyle = getStyle(styleId)
  const effectivePrice = priceWithPromo(product.price, promoInfo)

  const applyPromo = async () => {
    const raw = promo.trim()
    if (!raw) { setPromoInfo(null); setPromoError(null); return }
    setPromoBusy(true)
    setPromoError(null)
    try {
      const info = await validatePromo(raw)
      if (info) {
        setPromoInfo(info)
        setPromoError(null)
      } else {
        setPromoInfo(null)
        setPromoError('Code promo invalide ou expiré.')
      }
    } catch {
      setPromoError('Erreur de validation du code promo.')
    } finally {
      setPromoBusy(false)
    }
  }

  const canGoNext = step === 1 ? !!avatar : step === 2 ? !!(size && color) : !!(image && form.nom && form.telephone)

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const photoBlob = await compressImageToBlob(image)
      const created = await createOrder({
        client: { ...form },
        product: { id: product.id, name: product.name, price: product.price },
        avatar: { id: avatar.id, style: avatar.style, name: avatar.name },
        photoFile: photoBlob,
        options: { size, color },
        promo: promoInfo ? { code: promo.trim().toUpperCase(), discount: promoInfo.discount } : null,
      })
      setOrder(created)
      setStep(4)
    } catch (e) {
      setSubmitError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (order) {
    return (
      <div className="container" style={successWrapStyle}>
        <div style={successCardStyle}>
          <div style={successIconStyle}>⚡</div>
          <h1 style={successTitleStyle}>Commande <span className="gradient-text">{order.code}</span> reçue !</h1>
          <p style={successTextStyle}>
            Nos artistes créent <strong>3 déclinaisons</strong> de ton toon style <strong>{getStyle(order.avatar.style).name}</strong>{' '}
            sur ton <strong>{order.product.name}</strong>{' '}
            <strong>{order.options?.size}</strong> {order.options?.color && <strong>{order.options.color}</strong>}{' '}
            ({formatPrice(priceWithPromo(order.product.price, order.promo))}).
          </p>
          <div style={promiseStyle}>
            <span style={{ fontSize: '24px' }}>⏱️</span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--white)' }}>1 heure chrono</p>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Tu recevras un SMS/WhatsApp dès que tes 3 propositions sont prêtes.</p>
            </div>
          </div>
          <div style={stepsCardStyle}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gold)', textAlign: 'left', width: '100%' }}>Ce qui va se passer</p>
            <div style={stepLineStyle}><span style={stepNumStyle}>1</span> Nous créons tes 3 déclinaisons (≈ 1h)</div>
            <div style={stepLineStyle}><span style={stepNumStyle}>2</span> Reviens ici avec ton numéro <strong>{order.code}</strong> pour les voir et choisir ta préférée</div>
            <div style={stepLineStyle}><span style={stepNumStyle}>3</span> On imprime et on livre en 24-48h</div>
          </div>
          <p style={hintStyle}>
            Ta commande est déjà liée à ton numéro <strong>{form.telephone}</strong> — tu n'as rien à installer, ton téléphone est ton espace.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/suivi" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '15px' }}>
              Suivre ma commande
            </Link>
            <Link to="/espace/commandes" className="btn btn-secondary" style={{ padding: '16px 28px', fontSize: '15px' }}>
              Mes commandes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={wrapStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Commander mon <span className="gradient-text">toon</span></h1>
        <p style={subStyle}>3 étapes. Ton héros en 1h, ton t-shirt en 48h.</p>
      </div>

      <div style={stepperStyle}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} style={stepItemStyle}>
            <div style={{
              ...stepDotStyle,
              background: i + 1 === step ? 'var(--orange)' : i + 1 < step ? 'var(--yellow)' : 'var(--black-3)',
              color: i + 1 <= step ? 'var(--black)' : 'var(--gray-500)',
            }}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '12px', color: i + 1 === step ? 'var(--white)' : 'var(--gray-500)', fontWeight: i + 1 === step ? 600 : 400 }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>1. Choisis ton style et ton avatar d'exemple</h2>
          <div style={chipsStyle}>
            {ACTIVE_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => { setStyleId(s.id); setAvatar(null) }}
                style={{
                  ...chipStyle,
                  borderColor: s.id === styleId ? s.color : 'rgba(255,255,255,0.1)',
                  background: s.id === styleId ? `${s.color}22` : 'var(--black-3)',
                  color: s.id === styleId ? s.color : 'var(--gray-400)',
                }}
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
          <div style={avatarsGridStyle}>
            {avatars.map((a) => (
              <button
                key={a.id}
                onClick={() => setAvatar(a)}
                style={{
                  ...avatarCardStyle,
                  borderColor: avatar?.id === a.id ? selectedStyle.color : 'rgba(255,255,255,0.06)',
                  boxShadow: avatar?.id === a.id ? `0 0 0 2px ${selectedStyle.color}66` : 'none',
                }}
              >
                <AvatarImage avatar={a} size="100%" emojiSize={56} />
                <span style={{ fontSize: '12px', color: 'var(--gray-400)', fontWeight: 600 }}>{a.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>2. Choisis ton support</h2>
          <div style={productsGridStyle}>
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setProduct(p)}
                style={{
                  ...productCardStyle,
                  borderColor: product.id === p.id ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                  boxShadow: product.id === p.id ? '0 0 0 2px rgba(255,107,53,0.4)' : 'none',
                }}
              >
                <span style={{ fontSize: '48px' }}>{p.type === 'tee' ? '👕' : '👔'}</span>
                <strong style={{ fontSize: '17px', color: 'var(--white)' }}>{p.name}</strong>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: 'var(--orange)' }}>
                  {formatPrice(p.price)}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.5 }}>{p.desc}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={optionLabelStyle}>Taille <span style={{ color: 'var(--gray-600)' }}>(guide : S 88-96cm • M 96-104 • L 104-112 • XL 112-120)</span></p>
              <div style={optionRowStyle}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      ...optionChipStyle,
                      borderColor: size === s ? 'var(--orange)' : 'rgba(255,255,255,0.1)',
                      background: size === s ? 'rgba(255,107,53,0.15)' : 'var(--black-3)',
                      color: size === s ? 'var(--orange)' : 'var(--gray-400)',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {size && SIZE_GUIDE[size] && (
                <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Taille {size} : tour de poitrine {SIZE_GUIDE[size].tour} — {SIZE_GUIDE[size].note}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={optionLabelStyle}>Couleur du support</p>
              <div style={optionRowStyle}>
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      ...optionChipStyle,
                      borderColor: color === c ? 'var(--orange)' : 'rgba(255,255,255,0.1)',
                      background: color === c ? 'rgba(255,107,53,0.15)' : 'var(--black-3)',
                      color: color === c ? 'var(--orange)' : 'var(--gray-400)',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>3. Ta photo & tes infos</h2>
          <UploadArea compact onFileSelect={handleFile} preview={preview} loading={uploadLoading} error={uploadError} />
          <div className="order-form" style={formStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nom complet *</label>
              <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Koffi Aya" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Téléphone (Wave/OM) *</label>
              <input style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="Ex : +225 07 07 07 07 07" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Ville</label>
              <input style={inputStyle} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Quartier</label>
              <input style={inputStyle} value={form.quartier} onChange={(e) => setForm({ ...form, quartier: e.target.value })} placeholder="Ex : Cocody, Yopougon..." />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Adresse de livraison</label>
              <input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Ex : Rue des Jardins, non loin de la pharmacie" />
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section style={{ ...sectionStyle, marginTop: '20px' }}>
          <h2 style={sectionTitleStyle}>Vérifie ta commande</h2>
          <div style={recapCardStyle}>
            <div style={recapRowStyle}>
              <span style={recapIconStyle}>🦸</span>
              <div style={{ flex: 1 }}>
                <p style={recapLabelStyle}>Style & avatar</p>
                <p style={recapValueStyle}>{selectedStyle.name} — {avatar.name}</p>
              </div>
              <button style={editBtnStyle} onClick={() => setStep(1)}>Modifier</button>
            </div>
            <div style={recapRowStyle}>
              <span style={recapIconStyle}>{product.type === 'tee' ? '👕' : '👔'}</span>
              <div style={{ flex: 1 }}>
                <p style={recapLabelStyle}>Support</p>
                <p style={recapValueStyle}>{product.name} — Taille {size} • {color}</p>
              </div>
              <button style={editBtnStyle} onClick={() => setStep(2)}>Modifier</button>
            </div>
            <div style={recapRowStyle}>
              <span style={recapIconStyle}>💳</span>
              <div style={{ flex: 1 }}>
                <p style={recapLabelStyle}>Prix</p>
                <p style={recapValueStyle}>
                  {promoInfo ? (
                    <>
                      <s style={{ color: 'var(--gray-600)' }}>{formatPrice(product.price)}</s>{' '}
                      <strong style={{ color: 'var(--gold)' }}>{formatPrice(effectivePrice)}</strong>{' '}
                      <span style={{ color: 'var(--gold)' }}>−{promoInfo.discount}%</span>
                    </>
                  ) : (
                    formatPrice(product.price)
                  )}{' '}
                  — paiement à la livraison
                </p>
              </div>
            </div>
            <div style={recapRowStyle}>
              <span style={recapIconStyle}>🏷️</span>
              <div style={{ flex: 1 }}>
                <p style={recapLabelStyle}>Code promo</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    style={promoInputStyle}
                    value={promo}
                    onChange={(e) => { setPromo(e.target.value); setPromoInfo(null); setPromoError(null) }}
                    placeholder="Ex : NOEL10"
                    disabled={!!promoInfo}
                  />
                  {promoInfo ? (
                    <button style={promoBtnStyle} onClick={() => { setPromoInfo(null); setPromo('') }}>
                      Retirer
                    </button>
                  ) : (
                    <button
                      style={{ ...promoBtnStyle, opacity: promoBusy ? 0.6 : 1 }}
                      onClick={applyPromo}
                      disabled={promoBusy}
                    >
                      {promoBusy ? '...' : 'Appliquer'}
                    </button>
                  )}
                </div>
                {promoInfo && (
                  <p style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600, marginTop: '4px' }}>
                    ✓ {promoInfo.campaign_name} — remise de {promoInfo.discount}% appliquée
                  </p>
                )}
                {promoError && (
                  <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>✕ {promoError}</p>
                )}
              </div>
            </div>
            <div style={recapRowStyle}>
              <span style={recapIconStyle}>📷</span>
              <div style={{ flex: 1 }}>
                <p style={recapLabelStyle}>Photo</p>
                {preview ? (
                  <p style={recapValueStyle}>Photo ajoutée ✓</p>
                ) : (
                  <p style={{ ...recapValueStyle, color: '#ef4444' }}>Photo manquante</p>
                )}
              </div>
              <button style={editBtnStyle} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Voir</button>
            </div>
            <div style={recapRowStyle}>
              <span style={recapIconStyle}>📍</span>
              <div style={{ flex: 1 }}>
                <p style={recapLabelStyle}>Livraison</p>
                <p style={recapValueStyle}>
                  {form.nom || '—'} • {form.telephone || '—'}
                </p>
                <p style={recapValueStyle}>
                  {[form.quartier, form.ville, form.adresse].filter(Boolean).join(', ') || 'Adresse incomplète'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div style={footerStyle}>
        <div style={{ flex: 1 }}>
          {submitError && (
            <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600, lineHeight: 1.5 }}>⚠️ {submitError}</p>
          )}
          {!canGoNext && step < 3 && (
            <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontWeight: 600 }}>
              {step === 1
                ? '👈 Sélectionne un avatar d\'exemple pour continuer'
                : !size || !color
                  ? '👕 Choisis la taille et la couleur du support pour continuer'
                  : '📷 Ajoute ta photo et remplis ton nom + téléphone pour continuer'}
            </p>
          )}
        </div>
        {step > 1 && (
          <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>Retour</button>
        )}
        {step < 3 ? (
          <button className="btn btn-primary" disabled={!canGoNext} onClick={() => setStep(step + 1)}>
            Continuer →
          </button>
        ) : (
          <button className="btn btn-primary" disabled={!canGoNext || submitting} onClick={handleSubmit}>
            {submitting ? 'Création...' : `Confirmer — ${formatPrice(effectivePrice)}`}
          </button>
        )}
      </div>
    </div>
  )
}

const wrapStyle = { padding: '120px 0 80px', maxWidth: '900px' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', fontWeight: 700,
  letterSpacing: '-1px', color: 'var(--white)',
}

const subStyle = { fontSize: '15px', color: 'var(--gray-500)' }

const stepperStyle = { display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px' }

const stepItemStyle = { display: 'flex', alignItems: 'center', gap: '8px' }

const stepDotStyle = {
  width: '28px', height: '28px', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '13px', fontWeight: 700,
}

const sectionStyle = { display: 'flex', flexDirection: 'column', gap: '20px' }

const sectionTitleStyle = { fontSize: '20px', fontWeight: 600, color: 'var(--white)' }

const chipsStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap' }

const chipStyle = {
  padding: '10px 18px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
  border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
}

const avatarsGridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px',
}

const avatarCardStyle = {
  background: 'var(--black-3)', borderRadius: '18px', padding: '10px',
  border: '1px solid', display: 'flex', flexDirection: 'column', gap: '10px',
  cursor: 'pointer', transition: 'all 0.2s', alignItems: 'center',
}

const productsGridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px',
}

const optionLabelStyle = { fontSize: '14px', fontWeight: 600, color: 'var(--white)' }

const optionRowStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap' }

const optionChipStyle = {
  padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
  border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
}

const productCardStyle = {
  background: 'var(--black-3)', borderRadius: '20px', padding: '28px',
  border: '1px solid', display: 'flex', flexDirection: 'column', gap: '10px',
  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
}

const formStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' }

const labelStyle = { fontSize: '13px', fontWeight: 600, color: 'var(--gray-400)' }

const inputStyle = {
  padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
  background: 'var(--black-2)', color: 'var(--white)', fontSize: '15px', outline: 'none',
}

const footerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '40px' }

const recapCardStyle = {
  background: 'var(--black-3)', border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '20px', padding: '8px 24px', display: 'flex', flexDirection: 'column',
}

const recapRowStyle = {
  display: 'flex', alignItems: 'center', gap: '14px',
  padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
}

const recapIconStyle = { fontSize: '24px', width: '40px', height: '40px', borderRadius: '12px', background: 'var(--black-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }

const recapLabelStyle = { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-600)' }

const recapValueStyle = { fontSize: '14px', color: 'var(--white)', fontWeight: 500 }

const editBtnStyle = {
  background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--gray-400)',
  padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0,
}

const promoInputStyle = {
  padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)',
  background: 'var(--black-2)', color: 'var(--white)', fontSize: '14px', outline: 'none',
  textTransform: 'uppercase', letterSpacing: '1px', minWidth: '180px',
}

const promoBtnStyle = {
  background: 'rgba(255,107,53,0.12)', color: 'var(--orange)', border: '1px solid rgba(255,107,53,0.3)',
  padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
}

const successWrapStyle = { padding: '120px 0 80px', maxWidth: '640px' }

const successCardStyle = {
  background: 'var(--black-2)', borderRadius: '28px', padding: '48px',
  border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
}

const successIconStyle = {
  fontSize: '56px', width: '96px', height: '96px', borderRadius: '50%',
  background: 'linear-gradient(135deg, var(--orange), var(--yellow))',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  animation: 'pop 0.6s ease-out',
}

const successTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700,
  letterSpacing: '-1px', color: 'var(--white)',
}

const successTextStyle = { fontSize: '15px', color: 'var(--gray-400)', lineHeight: 1.7 }

const promiseStyle = {
  display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
  background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)',
  padding: '16px 20px', borderRadius: '16px', width: '100%',
}

const hintStyle = { fontSize: '13px', color: 'var(--gray-500)' }

const stepsCardStyle = {
  display: 'flex', flexDirection: 'column', gap: '10px',
  background: 'var(--black-3)', border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '16px', padding: '18px 20px', width: '100%',
}

const stepLineStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--gray-400)', textAlign: 'left', lineHeight: 1.5 }

const stepNumStyle = {
  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
  background: 'rgba(212,175,55,0.15)', color: 'var(--gold)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
}
