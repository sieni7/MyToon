export default function StickyCart({ visible, product, style: selectedStyle }) {
  if (!visible) return null

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <div style={infoStyle}>
          <span style={productNameStyle}>{product.name}</span>
          {selectedStyle && (
            <span style={styleTagStyle}>{selectedStyle.name}</span>
          )}
        </div>
        <div style={priceStyle}>{product.price} FCFA</div>
        <button className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14px', whiteSpace: 'nowrap' }}>
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}

const containerStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 200,
  background: 'rgba(17,17,17,0.95)',
  backdropFilter: 'blur(16px)',
  borderTop: '1px solid rgba(255,255,255,0.06)',
  padding: '12px 24px',
  animation: 'slide-up 0.3s ease-out',
}

const innerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
}

const infoStyle = { display: 'flex', alignItems: 'center', gap: '12px' }

const productNameStyle = { fontSize: '14px', fontWeight: 600, color: 'var(--white)' }

const styleTagStyle = {
  fontSize: '11px', fontWeight: 600, color: 'var(--orange)',
  background: 'rgba(255,107,53,0.1)', padding: '4px 10px',
  borderRadius: '100px',
}

const priceStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '20px', fontWeight: 700, color: 'var(--orange)',
  whiteSpace: 'nowrap',
}
