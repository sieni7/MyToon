import { useNavigate } from 'react-router-dom'
import { PRODUCTS, formatPrice } from '../../utils/constants'

const productVisuals = {
  tee: '👕',
  polo: '👔',
}

export default function Products() {
  const navigate = useNavigate()

  return (
    <section id="produits" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Nos <span className="gradient-text">supports</span>
          </h2>
          <p style={subStyle}>
            Coton local de Côte d'Ivoire. La création de ton toon est incluse.
          </p>
        </div>

        <div className="products-grid" style={gridStyle}>
          {PRODUCTS.map((product) => (
            <div key={product.id} className="card-gold glass" style={cardStyle}>
              <div style={visualStyle}>
                <span style={{ fontSize: '64px' }}>{productVisuals[product.type]}</span>
              </div>
              <div style={infoStyle}>
                <h3 style={nameStyle}>{product.name}</h3>
                <p style={descStyle}>{product.desc}</p>
                <div style={priceRowStyle}>
                  <span style={priceStyle}>{formatPrice(product.price)}</span>
                  <span style={includedStyle}>Toon inclus</span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '14px', padding: '14px 24px' }}
                  onClick={() => navigate('/commande')}
                >
                  Commander
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const sectionStyle = { padding: '100px 0', background: 'var(--black)' }

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '48px' }

const headerStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', fontWeight: 700,
  letterSpacing: '-1px', color: 'var(--white)',
}

const subStyle = { fontSize: '16px', color: 'var(--gray-500)' }

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  maxWidth: '760px',
  margin: '0 auto',
  width: '100%',
}

const cardStyle = {
  background: 'rgba(17, 17, 17, 0.6)',
  borderRadius: '24px', border: '1px solid',
  overflow: 'hidden',
  display: 'flex', flexDirection: 'column',
}

const visualStyle = {
  height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'radial-gradient(ellipse at 50% 100%, rgba(255,107,53,0.12), transparent 70%)',
}

const infoStyle = { padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }

const nameStyle = { fontSize: '22px', fontWeight: 700, color: 'var(--white)' }

const descStyle = { fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6, flex: 1 }

const priceRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0 8px' }

const priceStyle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--orange)' }

const includedStyle = {
  fontSize: '11px', fontWeight: 600, color: 'var(--green, #22c55e)',
  background: 'rgba(34,197,94,0.12)', padding: '4px 10px', borderRadius: '100px',
}
