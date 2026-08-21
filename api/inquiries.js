const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = { fullName: 100, businessName: 150, email: 254, phone: 40, businessType: 60, message: 2000 }
const buckets = new Map()

function clean(value, max) { return String(value || '').replace(/[<>]/g, '').trim().slice(0, max) }
function getIp(req) { return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown' }
function limited(ip) { const now = Date.now(); const record = buckets.get(ip) || { count: 0, start: now }; if (now - record.start > 60 * 60 * 1000) { buckets.set(ip, { count: 1, start: now }); return false } record.count += 1; buckets.set(ip, record); return record.count > 5 }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })
  if (limited(getIp(req))) return res.status(429).json({ message: 'Too many requests. Please try again later.' })
  const body = req.body || {}
  const form = Object.fromEntries(Object.entries(LIMITS).map(([key, limit]) => [key, clean(body[key], limit)]))
  const missing = Object.entries(form).filter(([key, value]) => key !== 'phone' && !value).map(([key]) => key)
  if (missing.length || !EMAIL_RE.test(form.email)) return res.status(400).json({ message: 'Please check the form details and try again.' })
  if (!process.env.RECAPTCHA_SECRET_KEY || !body.captchaToken) return res.status(400).json({ message: 'Please complete the reCAPTCHA check.' })
  try {
    const captcha = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: body.captchaToken, remoteip: getIp(req) }) })
    const result = await captcha.json()
    if (!result.success) return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' })
    if (!process.env.RESEND_API_KEY || !process.env.BENTA_INQUIRY_RECIPIENT || !process.env.BENTA_EMAIL_FROM) return res.status(503).json({ message: 'Inquiry delivery is not configured yet.' })
    const text = `New Benta POS Inquiry\n\nName: ${form.fullName}\nBusiness: ${form.businessName}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not provided'}\nBusiness Type: ${form.businessType}\n\nMessage:\n${form.message}`
    const email = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.BENTA_EMAIL_FROM, to: [process.env.BENTA_INQUIRY_RECIPIENT], reply_to: form.email, subject: `New Benta POS Inquiry — ${form.businessName}`, text }) })
    if (!email.ok) return res.status(502).json({ message: 'We could not deliver your inquiry. Please try again.' })
    return res.status(200).json({ ok: true })
  } catch { return res.status(500).json({ message: 'Something went wrong. Please try again.' }) }
}
