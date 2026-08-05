import { supabase } from '../lib/supabase'

export async function generatePrintPdf(code) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Session requise')

  const { data, error } = await supabase.functions.invoke('generate-print-pdf', {
    body: { code },
    headers: { Authorization: `Bearer ${session.access_token}` },
  })
  if (error) throw new Error(error.message || "Échec de la génération du PDF")
  if (!data?.ok) throw new Error(data?.error || "Échec de la génération du PDF")
  return data.path
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