import { useState, useCallback } from 'react'
import Layout from './components/layout/Layout'
import SplashScreen from './components/hero/SplashScreen'
import Hero from './components/hero/Hero'
import UploadArea from './components/upload/UploadArea'
import StyleSelector from './components/preview/StyleSelector'
import TShirtPreview from './components/preview/TShirtPreview'
import Features from './components/features/Features'
import Phases from './components/features/Phases'
import Testimonials from './components/features/Testimonials'
import FAQ from './components/features/FAQ'
import Gallery from './components/gallery/Gallery'
import CTA from './components/cta/CTA'
import StickyCart from './components/layout/StickyCart'
import ProgressBar from './components/layout/ProgressBar'
import { useImageUpload } from './hooks/useImageUpload'
import { STYLES, PRODUCTS } from './utils/constants'
import './styles/globals.css'
import './styles/responsive.css'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const { preview, loading, error, handleFile, reset } = useImageUpload()
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id)
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].id)

  const product = PRODUCTS.find((p) => p.id === selectedProduct) || PRODUCTS[0]
  const style = STYLES.find((s) => s.id === selectedStyle)

  const handleCtaClick = useCallback(() => {
    const el = document.getElementById('upload')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />
  }

  return (
    <Layout>
      <ProgressBar />

      <Hero onCtaClick={handleCtaClick} />

      <UploadArea onFileSelect={handleFile} preview={preview} loading={loading} error={error} />

      <section id="preview-section" style={previewSectionStyle}>
        <div className="container" style={previewContainerStyle}>
          <h2 className="section-title" style={previewTitleStyle}>
            Ton <span className="gradient-text">héros</span> prend vie
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
      <Phases />
      <Testimonials />
      <Gallery />
      <FAQ />
      <CTA />

      <StickyCart
        visible={!!preview}
        product={product}
        style={style}
      />
    </Layout>
  )
}

const previewSectionStyle = { padding: '100px 0', background: 'var(--black)' }

const previewContainerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }

const previewTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700,
  textAlign: 'center', letterSpacing: '-1px', color: 'var(--white)',
}

const previewGridStyle = {
  display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '48px',
  alignItems: 'start', width: '100%', maxWidth: '800px',
}
