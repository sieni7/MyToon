import { getStatus, getStyle, ORDER_STATUSES, formatPrice } from '../../utils/constants'
import { chooseVariation } from '../../services/orders'

export default function OrderView({ order, full = false, onChanged }) {
  const currentIndex = ORDER_STATUSES.findIndex((s) => s.id === order.status)

  const handleChoose = (idx) => {
    chooseVariation(order.id, idx)
    if (onChanged) onChanged()
  }

  return (
    <div style={cardStyle}>
      <div style={orderHeaderStyle}>
        <div>
          <h2 style={orderIdStyle}>{order.id}</h2>
          <p style={orderMetaStyle}>
            {getStyle(order.avatar.style).name} • {order.product.name} • {formatPrice(order.product.price)}
          </p>
        </div>
        <div style={statusBadgeStyle}>
          {getStatus(order.status).icon} {getStatus(order.status).label}
        </div>
      </div>

      <div style={timelineStyle}>
        {ORDER_STATUSES.map((status, i) => {
          const done = i < currentIndex || order.status === status.id
          const active = i === currentIndex
          return (
            <div key={status.id} style={timelineItemStyle}>
              <div style={timelineLeftStyle}>
                <div style={{
                  ...timelineDotStyle,
                  background: done ? 'var(--orange)' : active ? 'var(--yellow)' : 'var(--black-3)',
                }}>
                  {done ? (active ? status.icon : '✓') : status.icon}
                </div>
                {i < ORDER_STATUSES.length - 1 && (
                  <div style={{ ...timelineLineStyle, background: i < currentIndex ? 'var(--orange)' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
              <div style={timelineContentStyle}>
                <p style={{ ...timelineLabelStyle, color: done ? 'var(--white)' : 'var(--gray-500)' }}>
                  {status.label}
                </p>
                {active && <p style={timelineDescStyle}>{status.desc}</p>}
              </div>
            </div>
          )
        })}
      </div>

      {full && (order.status === 'propositions_pretes' || order.status === 'validation_attente' || order.status === 'validee') && (
        <div style={variationsSectionStyle}>
          <h3 style={variationsTitleStyle}>Tes 3 déclinaisons — choisis ta préférée</h3>
          <div className="variations-grid" style={variationsGridStyle}>
            {order.variations.map((variation, i) => {
              const isChosen = order.chosenVariation === variation
              return (
                <div key={i} style={{ ...variationCardStyle, borderColor: isChosen ? 'var(--yellow)' : 'rgba(255,255,255,0.08)' }}>
                  <img src={variation} alt={`Déclinaison ${i + 1}`} style={variationImgStyle} />
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-400)' }}>Déclinaison {i + 1}</p>
                  {isChosen ? (
                    <span style={chosenBadgeStyle}>✓ Choisie</span>
                  ) : (
                    order.status !== 'validee' && (
                      <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px', width: '100%' }} onClick={() => handleChoose(i)}>
                        Choisir celle-ci
                      </button>
                    )
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {full && (
        <div className="tracking-photo-row" style={photoRowStyle}>
          <div style={photoBoxStyle}>
            <p style={photoLabelStyle}>📷 Ta photo</p>
            {order.photoDataUrl && <img src={order.photoDataUrl} alt="Photo du client" style={photoImgStyle} />}
          </div>
          <div style={infoBoxStyle}>
            <p style={photoLabelStyle}>👤 Livraison</p>
            <p style={infoTextStyle}><strong>{order.client.nom}</strong></p>
            <p style={infoTextStyle}>{order.client.telephone}</p>
            <p style={infoTextStyle}>
              {order.product.name} — Taille {order.options?.size || '—'} • {order.options?.color || '—'}
            </p>
            <p style={infoTextStyle}>
              {[order.client.quartier, order.client.ville, order.client.adresse].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  background: 'var(--black-2)', borderRadius: '24px', padding: '32px',
  border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex', flexDirection: 'column', gap: '28px',
}

const orderHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }

const orderIdStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '26px', fontWeight: 700, color: 'var(--white)' }

const orderMetaStyle = { fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }

const statusBadgeStyle = {
  background: 'rgba(255,107,53,0.12)', color: 'var(--orange)',
  padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700,
}

const timelineStyle = { display: 'flex', flexDirection: 'column' }

const timelineItemStyle = { display: 'flex', gap: '16px' }

const timelineLeftStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' }

const timelineDotStyle = {
  width: '36px', height: '36px', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '16px', flexShrink: 0,
}

const timelineLineStyle = { width: '2px', flex: 1, minHeight: '28px' }

const timelineContentStyle = { paddingBottom: '20px' }

const timelineLabelStyle = { fontSize: '15px', fontWeight: 600, paddingTop: '6px' }

const timelineDescStyle = { fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px', maxWidth: '420px', lineHeight: 1.6 }

const variationsSectionStyle = { borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }

const variationsTitleStyle = { fontSize: '18px', fontWeight: 700, color: 'var(--white)' }

const variationsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }

const variationCardStyle = {
  border: '1px solid', borderRadius: '16px', padding: '10px',
  display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center',
  background: 'var(--black-3)',
}

const variationImgStyle = { width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '10px' }

const chosenBadgeStyle = {
  background: 'rgba(251,191,36,0.15)', color: 'var(--yellow)',
  padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, width: '100%', textAlign: 'center',
}

const photoRowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }

const photoBoxStyle = { display: 'flex', flexDirection: 'column', gap: '10px' }

const photoLabelStyle = { fontSize: '13px', fontWeight: 700, color: 'var(--gray-400)' }

const photoImgStyle = { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }

const infoBoxStyle = { display: 'flex', flexDirection: 'column', gap: '4px' }

const infoTextStyle = { fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.5 }
