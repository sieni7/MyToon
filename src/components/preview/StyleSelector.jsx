import { STYLES, PRODUCTS } from '../../utils/constants'

export default function StyleSelector({ selectedStyle, selectedProduct, onStyleChange, onProductChange }) {
  return (
    <div style={containerStyle}>
      <div style={groupStyle}>
        <h3 style={groupTitle}>Style toon</h3>
        <div className="style-grid" style={gridStyle}>
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              style={{
                ...cardStyle,
                borderColor: selectedStyle === style.id ? style.color : 'rgba(255,255,255,0.06)',
                background: selectedStyle === style.id ? `${style.color}12` : 'var(--black-3)',
              }}
            >
              <span style={emojiStyle}>{style.emoji}</span>
              <span style={{ fontWeight: 600, fontSize: '14px', color: selectedStyle === style.id ? style.color : 'var(--gray-400)' }}>
                {style.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--gray-600)', lineHeight: 1.4 }}>{style.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={groupStyle}>
        <h3 style={groupTitle}>Support</h3>
        <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => onProductChange(product.id)}
              style={{
                ...productCardStyle,
                borderColor: selectedProduct === product.id ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                background: selectedProduct === product.id ? 'rgba(255,107,53,0.08)' : 'var(--black-3)',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: product.color,
                border: product.id === 'tee-white' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '14px', color: selectedProduct === product.id ? 'var(--white)' : 'var(--gray-400)' }}>
                  {product.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--orange)', fontWeight: 600 }}>
                  {product.price} FCFA
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
}

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const groupTitle = {
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: 'var(--gray-500)',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '10px',
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '20px 16px',
  borderRadius: '16px',
  border: '1px solid',
  cursor: 'pointer',
  transition: 'all 0.2s',
  background: 'none',
  fontFamily: 'inherit',
}

const emojiStyle = {
  fontSize: '32px',
}

const productCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  padding: '14px 18px',
  borderRadius: '14px',
  border: '1px solid',
  cursor: 'pointer',
  transition: 'all 0.2s',
  background: 'none',
  fontFamily: 'inherit',
  width: '100%',
  textAlign: 'left',
}
