import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const BASE = 'http://localhost:5173'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const jpgPath = 'C:/Users/PCMARK~1/AppData/Local/Temp/opencode/mytoon-ui-test.jpg'
writeFileSync(jpgPath, Buffer.from(
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==',
  'base64'
))

const browser = await chromium.launch({ channel: 'chromium' })
const results = []
const check = (label, cond) => {
  results.push({ label, ok: !!cond })
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`)
}

let code = null

// ---------- CONTEXTE CLIENT (anonyme) ----------
const clientCtx = await browser.newContext()
const client = await clientCtx.newPage()
const clientErrors = []
client.on('pageerror', (e) => clientErrors.push(String(e)))

try {
  await client.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await client.locator('h1').first().waitFor({ timeout: 15000 })
  check('home page charge (h1 visible)', true)

  await client.goto(`${BASE}/commande`, { waitUntil: 'networkidle' })
  await client.getByRole('button', { name: /Toon Manga 01/ }).click()
  await client.getByRole('button', { name: /Continuer/ }).click()

  await client.getByRole('button', { name: 'M', exact: true }).click()
  await client.getByRole('button', { name: 'Blanc', exact: true }).click()
  await client.getByRole('button', { name: /Continuer/ }).click()

  await client.locator('input[type=file]').setInputFiles(jpgPath)
  await client.getByPlaceholder('Ex : Koffi Aya').fill('Test UI Koffi')
  await client.getByPlaceholder('Ex : +225 07 07 07 07 07').fill('+225 07 16 53 55 80')
  await client.getByText('Vérifie ta commande').waitFor()
  check('récapitulatif affiché (photo, taille, prix)', await client.getByText('Photo ajoutée ✓').isVisible().catch(() => false))
  await client.getByRole('button', { name: /Confirmer/ }).click()

  await client.getByText(/reçue !/).waitFor({ timeout: 20000 })
  code = (await client.locator('span.gradient-text').first().textContent())?.trim()
  check('code de suivi MT-XXXX affiché', /^MT-\d{4}$/.test(code || ''))
  console.log(`   code = ${code}`)
  if (!/^MT-\d{4}$/.test(code || '')) throw new Error('code invalide à la commande')

  await client.locator('main').getByRole('link', { name: 'Suivre ma commande' }).click()
  await client.getByPlaceholder('MT-0001').fill(code)
  await client.getByRole('button', { name: 'Suivre' }).click()
  await client.getByText(code, { exact: true }).first().waitFor({ timeout: 15000 })
  check('client suit sa commande (statut reçue visible)', await client.getByText(/📩 Commande reçue/).first().isVisible().catch(() => false))
  check('aucune erreur JS côté client', clientErrors.length === 0)
} catch (e) {
  check(`client flow — ${e.message}`, false)
}

// ---------- CONTEXTE ADMIN ----------
const adminCtx = await browser.newContext()
const admin = await adminCtx.newPage()

try {
  await admin.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await admin.getByPlaceholder('Email administrateur').fill(ADMIN_EMAIL)
  await admin.getByPlaceholder('Mot de passe').fill(ADMIN_PASSWORD)
  await admin.getByRole('button', { name: 'Accéder' }).click()
  await admin.getByText('Atelier MyToon').waitFor({ timeout: 15000 })
  check('admin connecté (Atelier MyToon visible)', true)

  const card = admin.locator(`div[style*="border-radius"]:has-text("${code}")`).first()
  await card.locator('button').first().click()
  await admin.getByText('🦸 Avatar de référence (style à recréer)', { exact: true }).waitFor()
  check('carte commande : avatar de référence affiché', await admin.getByText('Toon Manga 01').first().isVisible().catch(() => false))
  await admin.locator('img[alt="Photo"]').waitFor({ timeout: 10000 })
  check('carte commande : photo du client affichée', true)

  await admin.locator('input[type=file]').first().setInputFiles([jpgPath, jpgPath, jpgPath])
  await admin.getByText(/✨ 3 propositions prêtes/).first().waitFor({ timeout: 15000 })
  check('admin dépose 3 déclinaisons → propositions prêtes', true)
  await admin.locator('img[alt^="Déclinaison"]').first().waitFor({ timeout: 10000 })
  check('déclinaisons visibles dans la carte', (await admin.locator('img[alt^="Déclinaison"]').count()) >= 3)
} catch (e) {
  check(`admin flow — ${e.message}`, false)
}

// ---------- CLIENT VALIDE SA DÉCLINAISON ----------
try {
  await client.goto(`${BASE}/suivi`, { waitUntil: 'networkidle' })
  await client.getByPlaceholder('MT-0001').fill(code)
  await client.getByRole('button', { name: 'Suivre' }).click()
  await client.getByRole('button', { name: 'Choisir celle-ci' }).first().waitFor({ timeout: 15000 })
  check('client voit ses 3 déclinaisons à valider', true)
  await client.getByRole('button', { name: 'Choisir celle-ci' }).first().click()
  await client.getByText('✓ Choisie').first().waitFor({ timeout: 15000 })
  check('client valide une déclinaison → Validée', await client.getByText(/✅ Validée/).first().isVisible().catch(() => false))
} catch (e) {
  check(`validation client — ${e.message}`, false)
}

// ---------- ADMIN : PRODUCTION ----------
try {
  await admin.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await admin.getByText('Atelier MyToon').waitFor()
  const card = admin.locator(`div[style*="border-radius"]:has-text("${code}")`).first()
  await card.locator('button').first().click()
  await admin.getByPlaceholder('Imprimeur partenaire (nom ou id)').fill('Imprimerie Yopougon')
  await admin.getByRole('button', { name: 'Assigner' }).click()
  await admin.getByText('Passer en impression').click()
  await admin.getByText(/🖨️ En impression/).first().waitFor({ timeout: 15000 })
  check('admin assigne imprimeur + Passer en impression', true)
  await admin.getByText('Passer en expédition').click()
  await admin.getByText(/🚚 Expédiée/).first().waitFor({ timeout: 15000 })
  await admin.getByText('Marquer comme livrée').click()
  await admin.getByText(/📦 Livrée/).first().waitFor({ timeout: 15000 })
  check('admin : expédiée → livrée', true)
} catch (e) {
  check(`admin production — ${e.message}`, false)
}

// ---------- CLIENT : SUIVI FINAL ----------
try {
  await client.goto(`${BASE}/suivi`, { waitUntil: 'networkidle' })
  await client.getByPlaceholder('MT-0001').fill(code)
  await client.getByRole('button', { name: 'Suivre' }).click()
  await client.getByText(/📦 Livrée/).first().waitFor({ timeout: 15000 })
  check('client voit le statut final : Livrée', true)
} catch (e) {
  check(`suivi final client — ${e.message}`, false)
}

await browser.close()

// ---------- NETTOYAGE (via API admin) ----------
try {
  const { createClient } = await import('@supabase/supabase-js')
  const adminApi = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
  if (code) {
    const { data: order } = await adminApi.from('orders').select('photo_path, variations').eq('code', code).maybeSingle()
    if (order) {
      const paths = [order.photo_path, ...(order.variations || [])].filter(Boolean)
      if (paths.length) await adminApi.storage.from('media').remove(paths)
      await adminApi.from('orders').delete().eq('code', code)
      console.log('   (commande de test supprimée)')
    }
  }
  const { error: delOld } = await adminApi.from('orders').delete().in('code', ['MT-0003'])
  if (!delOld) console.log('   (ancienne commande MT-0003 de test supprimée)')
} catch (e) {
  console.log('   nettoyage ignoré :', e.message)
}

const failed = results.filter((r) => !r.ok)
console.log(`\n=== RÉSULTAT UI : ${results.length - failed.length}/${results.length} PASS ===`)
if (failed.length) {
  console.log('ÉCHECS :', failed.map((f) => f.label).join(' ; '))
  process.exit(1)
}
