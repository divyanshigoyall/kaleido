import { mockReport } from './mock'
export { STAGES } from './mock'

// Sample data is on by default. When the backend is ready, set VITE_USE_MOCK=false in frontend/.env
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function generateReport(question, opts, onStage) {
  if (USE_MOCK) return mockReport(question, opts, onStage)
  const res = await fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, ...opts }),
  })
  if (!res.ok) throw new Error((await res.text()) || `Request failed (${res.status})`)
  return res.json()
}
