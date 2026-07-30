import { useState } from 'react'
import Layout from './components/layout/Layout'
import Hero from './components/hero/Hero'
import UploadArea from './components/upload/UploadArea'
import StyleSelector from './components/preview/StyleSelector'
import TShirtPreview from './components/preview/TShirtPreview'
import Features from './components/features/Features'
import Steps from './components/features/Steps'
import CTA from './components/cta/CTA'
import Gallery from './components/gallery/Gallery'
import { useImageUpload } from './hooks/useImageUpload'
import { STYLES, PRODUCTS } from './utils/constants'
import './styles/globals.css'
import './styles/responsive.css'

export default function App() {
  const { preview, loading, error, handleFile, reset } = useImageUpload()
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id)
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].id)

  const product = PRODUCTS.find((p) => p.id === selectedProduct) || PRODUCTS[0]

  const handleCtaClick = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Layout>
      <Hero onCtaClick={handleCtaClick} />

      <UploadArea onFileSelect={handleFile} preview={preview} loading={loading} error={error} />

      <section style={previewSectionStyle}>
        <div className="container" style={previewContainerStyle}>
          <h2 className="section-title" style={previewTitleStyle}>
            2. Personnalise ton <span className="gradient-text">héros</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', textAlign: 'center' }}>
            Choisis ton style et ton support
          </p>

          <div className="preview-grid" style={previewGridStyle}>
            <TShirtPreview product={product} image={preview} />
            <StyleSelector
              selectedStyle={selectedStyle}
              selectedProduct={selectedProduct}
              onStyleChange={setSelectedStyle}
              onProductChange={setSelectedProduct}
            />
          </div>

          {preview && (
            <button className="btn btn-secondary" onClick={reset} style={{ marginTop: '8px', fontSize: '13px', padding: '12px 28px' }}>
              Changer de photo
            </button>
          )}

          <button className="btn btn-primary" style={{ marginTop: '24px', fontSize: '16px', padding: '18px 44px' }}>
            Ajouter au panier — {product.price} FCFA
          </button>
        </div>
      </section>

      <Features />
      <Steps />
      <Gallery />
      <CTA />
    </Layout>
  )
}

const previewSectionStyle = {
  padding: '100px 0',
  background: 'var(--black)',
}

const previewContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
}

const previewTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '36px',
  fontWeight: 700,
  textAlign: 'center',
  letterSpacing: '-1px',
  color: 'var(--white)',
}

const previewGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: '48px',
  alignItems: 'start',
  width: '100%',
  maxWidth: '800px',
}
