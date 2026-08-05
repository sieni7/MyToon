import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const URL = process.env.SUPABASE_URL
const SECRET = process.env.SUPABASE_SECRET_KEY
const PUBLISHABLE = process.env.SUPABASE_PUBLISHABLE_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const api = createClient(URL, SECRET, { auth: { persistSession: false } })

let failed = 0
const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`) }

let code = null
try {
  // seed un ordre avec déclinaison validée + image
  const { data: c } = await api.rpc('next_order_code')
  code = c
  const { data: orders } = await api.from('orders').insert({
    code,
    owner_user_id: null, owner_phone: '0700000000',
    client: { nom: 'Test Print', telephone: '0700000000', quartier: 'Cocody', ville: 'Abidjan', adresse: '' },
    product: { id: 'tee', name: 'T-shirt coton local', price: 10000 },
    avatar: { id: 'manga-01', style: 'manga', name: 'Toon Manga 01' },
    options: { size: 'M', color: 'Blanc' },
    photo_path: null,
    status: 'validee',
    timeline: [{ status: 'validee', date: new Date().toISOString(), note: 'seed' }],
    variations: [`variations/${code}/1.jpg`],
    chosen_variation: `variations/${code}/1.jpg`,
  }).select()
  if (!orders?.[0]) throw new Error('insert ordre')

  // upload une vraie image (avatar du site) dans variations/{code}/1.jpg
  const imageBytes = readFileSync('public/avatars/avatar-manga-01.jpg')
  const { error: upErr } = await api.storage.from('media').upload(`variations/${code}/1.jpg`, imageBytes, { upsert: true, contentType: 'image/jpeg' })
  if (upErr) throw new Error('upload image : ' + upErr.message)

  // connexion admin pour invoquer la fonction
  const admin = createClient(URL, PUBLISHABLE)
  await admin.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  const { data: { session } } = await admin.auth.getSession()

  const fnResp = await fetch(`${URL}/functions/v1/generate-print-pdf`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  const fnBody = await fnResp.json()
  check('fonction retourne ok + path', fnResp.status === 200 && fnBody.ok === true && typeof fnBody.path === 'string')
  if (fnResp.status !== 200) console.log('   statut', fnResp.status, '->', JSON.stringify(fnBody))
  const path = fnBody.path
  console.log('   path =', path)

  const { data: pdfBytes } = await api.storage.from('media').download(path)
  const arr = new Uint8Array(await pdfBytes.arrayBuffer())
  const isPdf = arr.length > 5 && arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46 && arr[4] === 0x2d
  check('PDF valide (%PDF)', isPdf)
  console.log('   taille =', arr.length, 'octets')

  // URL signée
  const { data: urlData } = await admin.storage.from('media').createSignedUrl(path, 60)
  check('URL signée générée', !!urlData?.signedUrl)
} catch (e) {
  console.log('ERREUR :', e.message)
  process.exitCode = 1
} finally {
  if (code) {
    await api.storage.from('media').remove([`variations/${code}/1.jpg`, `print/${code.toLowerCase()}.pdf`])
    await api.from('orders').delete().eq('code', code)
  }
  console.log('   nettoyage OK')
}
console.log(failed ? `\n=== ${failed} FAIL ===` : '\n=== TOUS PASS ===')
process.exit(failed ? 1 : 0)