import { useNavigate } from 'react-router-dom'
import Hero from '../components/hero/Hero'
import LiveTicker from '../components/home/LiveTicker'
import BeforeAfter from '../components/home/BeforeAfter'
import Products from '../components/home/Products'
import Gallery from '../components/gallery/Gallery'
import WorksGallery from '../components/home/WorksGallery'
import Features from '../components/features/Features'
import Phases from '../components/features/Phases'
import Testimonials from '../components/features/Testimonials'
import FAQ from '../components/features/FAQ'
import CTA from '../components/cta/CTA'
import SectionDivider from '../components/layout/SectionDivider'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <Hero onCtaClick={() => navigate('/commande')} />
      <LiveTicker />
      <SectionDivider />
      <BeforeAfter />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <Products />
      <SectionDivider />
      <WorksGallery />
      <SectionDivider />
      <Gallery />
      <SectionDivider />
      <Phases />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <FAQ />
      <SectionDivider />
      <CTA />
    </>
  )
}
