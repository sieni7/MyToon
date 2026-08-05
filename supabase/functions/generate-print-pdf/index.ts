// MyToon — Generate print PDF (A4, DTF)
// Génère un PDF A4 d'impression pour la déclinaison validée d'une commande.
// Appelé via supabase.functions.invoke('generate-print-pdf', { Authorization: <admin JWT> })
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')

const A4_W = 595.28 // points
const A4_H = 841.89
const MARGIN = 36
const ART_W = A4_W - MARGIN * 2
const ART_H = 450

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
}

function authClient(authHeader) {
  return createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: authHeader } },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'POST requis' }, 405)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Non connecté' }, 401)

  const supabase = authClient(authHeader)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'JWT invalide' }, 401)

  const { data: adm } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle()
  if (!adm) return json({ error: 'Non autorisé (admin requis)' }, 403)

  let body
  try { body = await req.json() } catch { return json({ error: 'Corps invalide' }, 400) }
  const { code } = body || {}
  if (!code) return json({ error: 'code manquant' }, 400)

  const { data: order, error: orderErr } = await supabase
    .from('orders').select('*').eq('code', String(code).trim().toUpperCase()).maybeSingle()
  if (orderErr || !order) return json({ error: 'Commande introuvable' }, 404)

  const chosen = order.chosen_variation
  if (!chosen) return json({ error: 'Aucune déclinaison validée' }, 400)

  const { data: signData, error: signErr } = await supabase.storage
    .from('media').createSignedUrl(chosen, 3600)
  if (signErr || !signData?.signedUrl) return json({ error: 'Image introuvable' }, 404)

  const imgResp = await fetch(signData.signedUrl)
  if (!imgResp.ok) return json({ error: 'Impossible de charger l\'image' }, 502)
  const imgBytes = new Uint8Array(await imgResp.arrayBuffer())

  // --- Build A4 PDF ---
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([A4_W, A4_H])
  const helv = await pdf.embedFont(StandardFonts.Helvetica)
  const helvB = await pdf.embedFont(StandardFonts.HelveticaBold)
  const orange = rgb(1, 0.42, 0.21)
  const dark = rgb(0.08, 0.08, 0.09)
  const gray = rgb(0.4, 0.4, 0.42)

  const title = `MyToon — Dossier d'impression`
  page.drawText(title, { x: MARGIN, y: A4_H - MARGIN, size: 17, font: helvB, color: dark })

  // Meta banner
  let meta = `${order.code}  ·  ${order.client?.nom || 'Client'}  ·  ${order.client?.telephone || ''}`
  page.drawText(meta, { x: MARGIN, y: A4_H - MARGIN - 20, size: 9, font: helv, color: gray })

  const product = order.product || {}
  const options = order.options || {}
  const printer = order.printer_id || 'À assigner'
  const line2 = `${product.name}  ·  Taille ${options.size || '—'}  ·  ${options.color || ''}`
  const line3 = `Imprimeur : ${printer}`
  const line4 = `Impression DTF haute qualité  ·  généré le ${new Date().toLocaleString('fr-FR')}`
  page.drawText(line2, { x: MARGIN, y: A4_H - MARGIN - 32, size: 9, font: helv, color: gray })
  page.drawText(line3, { x: MARGIN, y: A4_H - MARGIN - 44, size: 9, font: helv, color: gray })
  page.drawText(line4, { x: MARGIN, y: A4_H - MARGIN - 56, size: 8, font: helv, color: orange })

  // Artwork box (image au ratio conservé, centrée)
  page.drawRectangle({
    x: MARGIN, y: MARGIN, width: ART_W, height: ART_H,
    color: rgb(1, 1, 1), borderColor: rgb(0.85, 0.85, 0.86), borderWidth: 1,
  })

  let img
  try {
    img = await pdf.embedPng(imgBytes)
  } catch {
    try { img = await pdf.embedJpg(imgBytes) } catch {
      return json({ error: 'Format d\'image non supporté' }, 400)
    }
  }

  const imgW = img.width
  const imgH = img.height
  const artBoxW = ART_W - 24
  const artBoxH = ART_H - 24
  const scale = Math.min(artBoxW / imgW, artBoxH / imgH)
  const drawW = imgW * scale
  const drawH = imgH * scale
  page.drawImage(img, {
    x: MARGIN + (ART_W - drawW) / 2,
    y: MARGIN + (ART_H - drawH) / 2,
    width: drawW, height: drawH,
  })

  const pdfBytes = new Uint8Array(await pdf.save())
  const path = `print/${order.code.toLowerCase()}.pdf`

  const { error: upErr } = await supabase.storage
    .from('media').upload(path, pdfBytes, { upsert: true, contentType: 'application/pdf' })
  if (upErr) return json({ error: 'Échec enregistrement PDF : ' + upErr.message }, 500)

  const { error: updErr } = await supabase
    .from('orders').update({ print_pdf_path: path, updated_at: new Date().toISOString() }).eq('code', order.code)
  if (updErr) return json({ error: 'Échec mise à jour commande : ' + updErr.message }, 500)

  return json({ ok: true, path })
})