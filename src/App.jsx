import { useState } from 'react'
import InquiryForm from './components/InquiryForm'

function Logo() {
  return <a className="logo" href="#business" aria-label="Benta business"><img className="logo-image" src="/Benta.jpeg" alt="" /><span>Benta</span></a>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="navbar">
    <div className="container nav-inner">
      <Logo />
      <nav id="main-navigation" className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
        <a href="#business" onClick={close}>Business</a>
        <a className="mobile-menu-link" href="#inquiry" onClick={close}>Inquiry</a>
      </nav>
      <div className="nav-actions">
        <a className="nav-inquiry" href="#inquiry" onClick={close}>Inquiry <span aria-hidden="true">↗</span></a>
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
