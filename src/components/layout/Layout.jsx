import Header from './Header'
import Footer from './Footer'
import PromoBanner from './PromoBanner'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <PromoBanner />
      <main style={{ paddingTop: '72px' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
