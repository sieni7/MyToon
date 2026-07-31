import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SplashScreen from './components/hero/SplashScreen'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import TrackingPage from './pages/TrackingPage'
import AdminPage from './pages/AdminPage'
import EspacePage from './pages/EspacePage'
import MesCommandesPage from './pages/MesCommandesPage'
import CommandeDetailPage from './pages/CommandeDetailPage'
import './styles/globals.css'
import './styles/responsive.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/commande" element={<OrderPage />} />
          <Route path="/suivi" element={<TrackingPage />} />
          <Route path="/espace" element={<EspacePage />} />
          <Route path="/espace/commandes" element={<MesCommandesPage />} />
          <Route path="/espace/commande/:id" element={<CommandeDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
