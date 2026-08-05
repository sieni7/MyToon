import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const BASE = 'http://localhost:5173'
const URL = process.env.SUPABASE_URL
const SECRET = process.env.SUPABASE_SECRET_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const api = createClient(URL, SECRET, { auth: { persistSession: false } })

let failed = 0
const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`) }

let code = null
try {
  const { data: c } = await api.rpc('next_order_code')
  code = c
  const { data: orders } = await api.from('orders').insert({
    code,
    owner_user_id: null, owner_phone: '0700000000',
    client: { nom: 'Test Print UI', telephone: '0700000000', quartier: 'Cocody', ville: 'Abidjan', adresse: '' },
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
  const imageBytes = readFileSync('public/avatars/avatar-manga-01.jpg')
  const { error: upErr } = await api.storage.from('media').upload(`variations/${code}/1.jpg`, imageBytes, { upsert: true, contentType: 'image/jpeg' })
  if (upErr) throw new Error('upload image : ' + upErr.message)

  const browser = await chromium.launch({ channel: 'chromium' })
  const adminCtx = await browser.newContext()
  const admin = await adminCtx.newPage()
  const errors = []
  admin.on('pageerror', (e) => errors.push(String(e)))

  await admin.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await admin.getByPlaceholder('Email administrateur').fill(ADMIN_EMAIL)
  await admin.getByPlaceholder('Mot de passe').fill(ADMIN_PASSWORD)
  await admin.getByRole('button', { name: 'Accéder' }).click()
  await admin.getByText('Atelier MyToon').waitFor({ timeout: 15000 })
  check('admin connecté', true)

  await admin.getByText(code, { exact: true }).first().click()
  await admin.getByText("Fichier d'impression (PDF A4 / DTF)").waitFor({ timeout: 15000 })
  check('bloc Fichier d\'impression affiché', true)

  await admin.getByRole('button', { name: /Générer le PDF A4/ }).click()
  try {
    await admin.getByRole('button', { name: /📄 Télécharger/ }).waitFor({ timeout: 60000 })
    check('PDF généré → bouton Télécharger', true)
  } catch {
    const err = await admin.locator('div').filter({ hasText: "Fichier d'impression (PDF A4 / DTF)" }).first().textContent().catch(() => '')
    console.log('   → contenu bloc print :', JSON.stringify(err))
    check('PDF généré → bouton Télécharger', false)
    throw new Error('PDF non généré')
  }

  await admin.getByRole('button', { name: /Copier le lien/ }).click()
  await admin.getByText('✓ Copié').waitFor({ timeout: 10000 })
  check('lien signé copié dans le presse-papiers', true)

  check('aucune erreur JS admin', errors.length === 0)
  await browser.close()
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