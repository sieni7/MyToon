import { supabase, supabaseUrl } from '../lib/supabase'

export async function generatePrintPdf(code) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Session requise')

  const resp = await fetch(`${supabaseUrl}/functions/v1/generate-print-pdf`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  const body = await resp.json().catch(() => null)
  if (!resp.ok) throw new Error(body?.error || resp.statusText || 'Échec de la génération du PDF')
  if (!body?.ok) throw new Error(body?.error || 'Échec de la génération du PDF')
  return body.path
}

export async function getPrintPdfUrl(code, expiresIn = 60 * 60 * 24 * 7) {
  if (!supabase) return null
  const path = `print/${String(code).toLowerCase()}.pdf`
  const { data } = await supabase.storage.from('media').createSignedUrl(path, expiresIn)
  return data?.signedUrl || null
}

export async function downloadPrintPdf(code) {
  const url = await getPrintPdfUrl(code)
  if (!url) throw new Error('PDF introuvable')
  const resp = await fetch(url)
  const blob = await resp.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `impression-${code}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
}