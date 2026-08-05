import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import CampaignProvider from './context/CampaignProvider'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'
import SplashScreen from './components/hero/SplashScreen'
import HomePage from './pages/HomePage'
import './styles/globals.css'
import './styles/responsive.css'

const OrderPage = lazy(() => import('./pages/OrderPage'))
const TrackingPage = lazy(() => import('./pages/TrackingPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const EspacePage = lazy(() => import('./pages/EspacePage'))
const MesCommandesPage = lazy(() => import('./pages/MesCommandesPage'))
const CommandeDetailPage = lazy(() => import('./pages/CommandeDetailPage'))
const LegalPage = lazy(() => import('./pages/LegalPages'))

function RouteFallback() {
  return (
    <div className="container" style={{ padding: '120px 24px', textAlign: 'center', color: 'var(--gray-500)' }}>
      Chargement…
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  const [splashDone, setSplashDone] = useState(() => {
    try { return sessionStorage.getItem('mytoon_splash_seen') === '1' } catch { return false }
  })

  return (
    <CampaignProvider>
      {!splashDone ? (
        <SplashScreen
          onFinish={() => {
            try { sessionStorage.setItem('mytoon_splash_seen', '1') } catch { /* ignore */ }
            setSplashDone(true)
          }}
        />
      ) : (
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/commande" element={<OrderPage />} />
                  <Route path="/suivi" element={<TrackingPage />} />
                  <Route path="/espace" element={<EspacePage />} />
                  <Route path="/espace/commandes" element={<MesCommandesPage />} />
                  <Route path="/espace/commande/:id" element={<CommandeDetailPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/cgv" element={<LegalPage type="cgv" />} />
                  <Route path="/confidentialite" element={<LegalPage type="confidentialite" />} />
                  <Route path="/livraison-retours" element={<LegalPage type="livraison" />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Layout>
        </BrowserRouter>
      )}
    </CampaignProvider>
  )
}
