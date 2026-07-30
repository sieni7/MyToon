export default function TShirtPreview({ product, image }) {
  return (
    <div style={containerStyle}>
      <div style={{
        ...tshirtStyle,
        background: product.color === '#ffffff'
          ? 'linear-gradient(135deg, #f5f5f5, #e5e5e5)'
          : `linear-gradient(135deg, ${product.color}, ${product.color}dd)`,
        borderColor: product.color === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)',
      }}>
        <div style={{
          ...collarStyle,
          background: product.color === '#ffffff' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          ...sleeveLeftStyle,
          background: product.color === '#ffffff'
            ? 'linear-gradient(135deg, #f5f5f5, #e5e5e5)'
            : `linear-gradient(135deg, ${product.color}, ${product.color}dd)`,
          borderColor: product.color === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          ...sleeveRightStyle,
          background: product.color === '#ffffff'
            ? 'linear-gradient(135deg, #f5f5f5, #e5e5e5)'
            : `linear-gradient(135deg, ${product.color}, ${product.color}dd)`,
          borderColor: product.color === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          ...printAreaStyle,
          background: product.color === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.06)',
        }}>
          {image ? (
            <div style={{
              ...imageWrapperStyle,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />
          ) : (
            <div style={placeholderPrintStyle}>
              <span style={{ fontSize: '28px' }}>🎨</span>
              <p style={{ fontSize: '11px', color: 'var(--gray-600)', marginTop: '6px' }}>
                Ton héros ici
              </p>
            </div>
          )}
        </div>
      </div>
      <p style={labelStyle}>{product.name}</p>
      <p style={priceStyle}>{product.price} FCFA</p>
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
}

const tshirtStyle = {
  width: '240px',
  height: '280px',
  borderRadius: '16px',
  position: 'relative',
  border: '1px solid',
  transition: 'all 0.3s',
}

const collarStyle = {
  position: 'absolute',
  top: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '50px',
  height: '18px',
  borderRadius: '0 0 20px 20px',
}

const sleeveLeftStyle = {
  position: 'absolute',
  top: '6px',
  left: '-16px',
  width: '28px',
  height: '56px',
  borderRadius: '10px',
  border: '1px solid',
  borderRight: 'none',
}

const sleeveRightStyle = {
  position: 'absolute',
  top: '6px',
  right: '-16px',
  width: '28px',
  height: '56px',
  borderRadius: '10px',
  border: '1px solid',
  borderLeft: 'none',
}

const printAreaStyle = {
  position: 'absolute',
  top: '56px',
  left: '32px',
  right: '32px',
  bottom: '45px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}

const imageWrapperStyle = {
  width: '100%',
  height: '100%',
}

const placeholderPrintStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const labelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--gray-400)',
}

const priceStyle = {
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--orange)',
}
