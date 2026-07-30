import { useState, useCallback, useEffect } from 'react'
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
import { useCartoonize } from './hooks/useCartoonize'
import { STYLES, PRODUCTS } from './utils/constants'
import './styles/globals.css'
import './styles/responsive.css'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const { preview, loading: uploadLoading, error: uploadError, handleFile, reset: resetUpload } = useImageUpload()
  const { result: cartoonized, loading: toonLoading, error: toonError, cartoonize, reset: resetToon } = useCartoonize()
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id)
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].id)

  const product = PRODUCTS.find((p) => p.id === selectedProduct) || PRODUCTS[0]
  const style = STYLES.find((s) => s.id === selectedStyle)

  // Déclenche la transformation automatiquement quand :
  //   1. Une photo est uploadée (preview)
  //   2. L'utilisateur change de style (selectedStyle)
  useEffect(() => {
    if (preview && selectedStyle) {
      cartoonize(preview, selectedStyle)
    }
  }, [preview, selectedStyle, cartoonize])

  const handleReset = useCallback(() => {
    resetUpload()
    resetToon()
  }, [resetUpload, resetToon])

  const handleCtaClick = useCallback(() => {
    const el = document.getElementById('upload')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />
  }

  // L'image affichée sur le t-shirt : l'originale pendant la transformation,
  // la version cartoonisée une fois reçue.
  const displayImage = cartoonized || preview

  return (
    <Layout>
      <ProgressBar />

      <Hero onCtaClick={handleCtaClick} />

      <UploadArea onFileSelect={handleFile} preview={preview} loading={uploadLoading} error={uploadError} />

      <section id="preview-section" style={previewSectionStyle}>
        <div className="container" style={previewContainerStyle}>
          <h2 className="section-title" style={previewTitleStyle}>
            Ton <span className="gradient-text">héros</span> prend vie
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--gray-500)', textAlign: 'center' }}>
            Choisis ton style et ton support
          </p>

          {toonLoading && (
            <div style={transformingBadgeStyle}>
              <div style={miniSpinnerStyle} />
              Transformation en cours...
            </div>
          )}

          {toonError && (
            <div style={errorBannerStyle}>
              {toonError}
            </div>
          )}

          <div className="preview-grid" style={previewGridStyle}>
            <TShirtPreview product={product} image={displayImage} loading={toonLoading} />
            <StyleSelector
              selectedStyle={selectedStyle}
              selectedProduct={selectedProduct}
              onStyleChange={setSelectedStyle}
              onProductChange={setSelectedProduct}
            />
          </div>

          {preview && (
            <button className="btn btn-secondary" onClick={handleReset} style={{ marginTop: '8px', fontSize: '13px', padding: '12px 28px' }}>
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

const transformingBadgeStyle = {
  display: 'flex', alignItems: 'center', gap: '8px',
  padding: '8px 16px', borderRadius: '100px',
  background: 'rgba(255,107,53,0.1)', color: 'var(--orange)',
  fontSize: '13px', fontWeight: 600,
}

const miniSpinnerStyle = {
  width: '14px', height: '14px',
  border: '2px solid rgba(255,107,53,0.2)',
  borderTopColor: 'var(--orange)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

const errorBannerStyle = {
  padding: '12px 20px', borderRadius: '12px',
  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
  fontSize: '13px', fontWeight: 500, maxWidth: '500px',
  textAlign: 'center',
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
