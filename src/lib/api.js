export async function submitInquiry(payload) {
  const response = await fetch('/api/inquiries', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'We could not send your inquiry. Please try again.')
  return data
}
