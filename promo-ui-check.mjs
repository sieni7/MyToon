import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'

const URL = process.env.SUPABASE_URL
const SECRET = process.env.SUPABASE_SECRET_KEY
const api = createClient(URL, SECRET, { auth: { persistSession: false } })
const jpgPath = 'C:/Users/PCMARK~1/AppData/Local/Temp/opencode/mytoon-promo-test.jpg'
writeFileSync(jpgPath, Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==', 'base64'))

let failed = 0
const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`) }
let campaignId = null
let orderCode = null
try {
  const { data: c } = await api.from('campaigns').insert({
    code: 'promo-ui-camp', name: 'Promo UI', active: true,
    start_date: new Date(Date.now() - 1000).toISOString(),
    end_date: new Date(Date.now() + 86400000).toISOString(),
    promo_code: 'TESTCHECK', promo_discount: 10,
  }).select().single()
  campaignId = c.id

  const browser = await chromium.launch({ channel: 'chromium' })
  const client = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await client.goto('http://localhost:5173/commande', { waitUntil: 'domcontentloaded' })
  await client.getByRole('button', { name: /Toon Manga 01/ }).click()
  await client.getByRole('button', { name: /Continuer/ }).click()
  await client.getByRole('button', { name: 'M', exact: true }).click()
  await client.getByRole('button', { name: 'Blanc', exact: true }).click()
  await client.getByRole('button', { name: /Continuer/ }).click()
  await client.locator('input[type=file]').setInputFiles(jpgPath)
  await client.getByPlaceholder('Ex : Koffi Aya').fill('Test Promo')
  await client.getByPlaceholder('Ex : +225 07 07 07 07 07').fill('0700000000')
  await client.getByText('Vérifie ta commande').waitFor()

  check('prix initial 10 000 au récap', await client.getByText('10 000 FCFA').count() > 0)
  await client.getByPlaceholder('Ex : NOEL10').fill('testcheck')
  await client.getByRole('button', { name: 'Appliquer' }).click()
  await client.getByText(/-10%/).first().waitFor({ timeout: 10000 }).catch(() => {})
  check('remise −10% affichée', await client.getByText(/remise de 10%/).count() > 0)
  check('prix remisé 9 000 affiché', await client.getByText(/9\s*000\s*FCFA/).count() > 0)
  check('prix barré 10 000 conservé', await client.getByText('10 000 FCFA').count() > 0)

  await client.getByRole('button', { name: /Confirmer/ }).click()
  await client.getByText(/Commande .* reçue/).waitFor({ timeout: 20000 })
  const text = await client.textContent('body')
  orderCode = (text.match(/MT-\d+/g) || [])[0]
  check('commande créée (code MT-XXXX)', !!orderCode)

  await browser.close()

  const { data: order } = await api.from('orders').select('promo, product').eq('code', orderCode).maybeSingle()
  check('promo stockée sur la commande', order?.promo?.code === 'TESTCHECK' && order?.promo?.discount === 10)
  console.log(`\n=== ${failed === 0 ? 'TOUS' : ''} PASS === (code ${orderCode})`)
} finally {
  if (orderCode) { await api.from('orders').delete().eq('code', orderCode) }
  if (campaignId) { await api.from('campaigns').delete().eq('id', campaignId) }
  console.log('   nettoyage OK')
}
process.exit(failed ? 1 : 0)