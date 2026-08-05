import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import PromoBanner from './PromoBanner'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const hideFooter = pathname.startsWith('/admin')

  return (
    <>
      <Header />
      <PromoBanner />
      <main style={{ paddingTop: '72px' }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  )
}
