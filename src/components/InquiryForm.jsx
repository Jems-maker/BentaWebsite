import { useEffect, useRef, useState } from 'react'
import { submitInquiry } from '../lib/api'

const initialForm = { fullName: '', businessName: '', email: '', phone: '', businessType: '', message: '' }
const businessTypes = ['Retail Store', 'Sari-sari Store', 'Grocery Store', 'Convenience Store', 'Café', 'Restaurant', 'Pharmacy', 'Other']

function Field({ id, label, value, onChange, error, type = 'text', placeholder, required = false, children }) {
  const errorId = `${id}-error`
  const describedBy = error ? errorId : undefined
  return <div className="inquiry-field">
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    {children || <input id={id} name={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} aria-invalid={!!error} aria-describedby={describedBy} />}
    {error && <p className="inquiry-field-error" id={errorId} role="alert">{error}</p>}
  </div>
}

export default function InquiryForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [captcha, setCaptcha] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const captchaRef = useRef(null)
  const siteKey = String(import.meta.env.VITE_RECAPTCHA_SITE_KEY || '').trim()
  const captchaEnabled = Boolean(siteKey)

  useEffect(() => {
    if (!siteKey) {
      if (import.meta.env.DEV) console.error('Missing VITE_RECAPTCHA_SITE_KEY')
      return undefined
    }
    window.onBentaCaptcha = token => { setCaptcha(token); setErrors(current => ({ ...current, captcha: undefined })) }
    window.onBentaCaptchaExpired = () => setCaptcha('')
    if (!window.grecaptcha) {
      const script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js'
      script.async = true
      document.body.appendChild(script)
      return () => { script.remove(); delete window.onBentaCaptcha; delete window.onBentaCaptchaExpired }
    }
    return () => { delete window.onBentaCaptcha; delete window.onBentaCaptchaExpired }
  }, [siteKey])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } }, { threshold: 0.12 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const change = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    if (errors[name]) setErrors(current => ({ ...current, [name]: undefined }))
    if (errors.form) setErrors(current => ({ ...current, form: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Please enter your name.'
    if (!form.businessName.trim()) next.businessName = 'Please enter your business name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
    if (!form.businessType) next.businessType = 'Please select your business type.'
    if (!form.message.trim()) next.message = 'Please tell us a little about your business.'
    if (!captcha) next.captcha = captchaEnabled ? 'Please complete the reCAPTCHA check.' : 'reCAPTCHA is not configured yet.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const resetCaptcha = () => { setCaptcha(''); window.grecaptcha?.reset() }
  const resetForm = () => { setForm(initialForm); setErrors({}); setStatus('idle'); resetCaptcha() }
  const submit = async event => {
    event.preventDefault()
    if (status === 'loading' || !validate()) return
    setStatus('loading')
    try { await submitInquiry({ ...form, captchaToken: captcha }); setStatus('success') }
    catch { setStatus('error'); setErrors(current => ({ ...current, form: true })) }
  }

  return <section ref={sectionRef} className={`section inquiry-section ${isVisible ? 'inquiry-visible' : ''}`} id="inquiry"><div className="container inquiry-grid">
    <div className="inquiry-copy"><p className="eyebrow">Let’s talk about your counter</p><h2>Interested in Benta?</h2><p>Tell us about your business and we'll help you find the right POS setup for your needs.</p><ul className="inquiry-benefits">{['Simple setup', 'Works on Desktop, Tablet & Mobile', 'Fast POS workflow', 'Cash & GCash payments', 'Inventory and sales management'].map(benefit => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul></div>
    <div className="inquiry-card">{status === 'success' ? <div className="inquiry-success" role="status"><div className="inquiry-check" aria-hidden="true">✓</div><p className="eyebrow">Inquiry Sent</p><h3>Thanks for reaching out to Benta.</h3><p>We've received your inquiry and will get back to you soon.</p><button className="button secondary" onClick={resetForm}>Send Another Inquiry</button></div> : <form className="inquiry-form" onSubmit={submit} noValidate aria-busy={status === 'loading'}><div className="inquiry-heading"><h3>Tell us about your business</h3><p>We'll use these details to help you find the right setup.</p></div><div className="inquiry-form-row"><Field id="fullName" label="Full Name" value={form.fullName} onChange={change} error={errors.fullName} placeholder="Your name" required /><Field id="businessName" label="Business Name" value={form.businessName} onChange={change} error={errors.businessName} placeholder="Your business name" required /></div><div className="inquiry-form-row"><Field id="email" label="Email Address" type="email" value={form.email} onChange={change} error={errors.email} placeholder="you@example.com" required /><Field id="phone" label="Phone Number" value={form.phone} onChange={change} error={errors.phone} placeholder="09XX XXX XXXX" /></div><Field id="businessType" label="Business Type" value={form.businessType} onChange={change} error={errors.businessType} required><select id="businessType" name="businessType" value={form.businessType} onChange={change} required aria-invalid={!!errors.businessType} aria-describedby={errors.businessType ? 'businessType-error' : undefined}><option value="">Select business type</option>{businessTypes.map(type => <option key={type}>{type}</option>)}</select></Field><Field id="message" label="Message" value={form.message} onChange={change} error={errors.message} placeholder="Tell us about your business or what you'd like to know about Benta..." required><textarea id="message" name="message" value={form.message} onChange={change} placeholder="Tell us about your business or what you'd like to know about Benta..." rows="5" required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} /></Field>{captchaEnabled ? <div className="inquiry-captcha"><div ref={captchaRef} className="g-recaptcha" data-sitekey={siteKey} data-callback="onBentaCaptcha" data-expired-callback="onBentaCaptchaExpired"></div>{errors.captcha && <p className="inquiry-field-error" role="alert">{errors.captcha}</p>}</div> : <p className="inquiry-config-note">reCAPTCHA will appear here when VITE_RECAPTCHA_SITE_KEY is configured.</p>}{errors.form && <div className="inquiry-submit-error" role="alert"><strong>Something went wrong</strong><span>We couldn't send your inquiry. Please try again.</span><button type="button" onClick={() => setErrors(current => ({ ...current, form: undefined }))}>Try Again</button></div>}<button className="button primary inquiry-submit" disabled={status === 'loading'}>{status === 'loading' ? <><span className="inquiry-spinner" aria-hidden="true"></span>Sending...</> : <>Send Inquiry <span className="button-arrow" aria-hidden="true">↗</span></>}</button></form>}</div>
  </div></section>
}
