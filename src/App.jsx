import { useEffect, useState } from 'react'
import InquiryForm from './components/InquiryForm'

function Logo({ onClick }) {
  return <a className="logo" href="#business" aria-label="Benta business" onClick={onClick}><span className="logo-mark"><img className="logo-image" src="/Benta.jpeg" alt="" /></span><span>Benta</span></a>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('business')

  useEffect(() => {
    const sections = ['business', 'inquiry']
      .map(id => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting)
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 })

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const close = () => setOpen(false)
  const navigateTo = section => {
    setActiveSection(section)
    close()
  }

  return <header className="navbar">
    <div className="container nav-inner">
      <Logo onClick={() => navigateTo('business')} />
      <nav id="main-navigation" className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
        <a className={activeSection === 'business' ? 'active' : ''} href="#business" aria-current={activeSection === 'business' ? 'location' : undefined} onClick={() => navigateTo('business')}>Business</a>
        <a className={`mobile-menu-link ${activeSection === 'inquiry' ? 'active' : ''}`} href="#inquiry" aria-current={activeSection === 'inquiry' ? 'location' : undefined} onClick={() => navigateTo('inquiry')}>Inquiry</a>
      </nav>
      <div className="nav-actions">
        <a className={`nav-inquiry ${activeSection === 'inquiry' ? 'active' : ''}`} href="#inquiry" aria-current={activeSection === 'inquiry' ? 'location' : undefined} onClick={() => navigateTo('inquiry')}>Inquiry <span aria-hidden="true">↗</span></a>
        <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
          <span className="menu-bar"></span><span className="menu-bar"></span><span className="sr-only">Menu</span>
        </button>
      </div>
    </div>
  </header>
}

function BusinessHero() {
  const businesses = ['Sari-sari stores', 'Small retail', 'Groceries', 'Cafés', 'Convenience stores', 'Local shops']
  return <section className="business-hero" id="business">
    <div className="container business-hero-inner">
      <p className="eyebrow">Made for the everyday business</p>
      <h1>From sari-sari stores to local shops.</h1>
      <div className="business-divider" aria-hidden="true"></div>
      <ul className="business-types" aria-label="Businesses Benta supports">
        {businesses.map(business => <li key={business}>{business}</li>)}
      </ul>
    </div>
  </section>
}

export default function App() {
  return <>
    <Navbar />
    <main>
      <BusinessHero />
      <InquiryForm />
    </main>
  </>
}
