import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const URL = process.env.SUPABASE_URL
const SECRET = process.env.SUPABASE_SECRET_KEY
const PUBLISHABLE = process.env.SUPABASE_PUBLISHABLE_KEY
const api = createClient(URL, SECRET, { auth: { persistSession: false } })
const anon = createClient(URL, PUBLISHABLE)

const BANNER = '🎯 Test Check : -10% avec le code TESTCHECK'
const DISCOUNT = 10

let failed = 0
const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`) }

let testCampaignId = null
try {
  const { data: created } = await api.from('campaigns').insert({
    code: 'test-check-camp', name: 'Test Check',
    start_date: new Date(Date.now() - 1000).toISOString(),
    end_date: new Date(Date.now() + 86400000).toISOString(),
    active: true,
    banner_text: BANNER, // placeholder replaced below
    accent_color: '#22c55e',
    promo_code: 'TESTCHECK',
    promo_discount: DISCOUNT,
  }).select().single()
  if (!created) { console.log('ERREUR création campagne (secret/RLS ?)'); process.exit(1) }
  testCampaignId = created.id

  const { data: active } = await anon.rpc('get_active_campaign')
  check('get_active_campaign -> campagne active', active?.code === 'test-check-camp')
  check('promo exposé via campagne active', active?.promo_code === 'TESTCHECK' && active?.promo_discount === DISCOUNT)

  const { data: promo } = await anon.rpc('validate_promo', { p_code: 'testcheck' })
  check('validate_promo OK (insensible casse)', promo?.discount === DISCOUNT && promo?.campaign_code === 'test-check-camp')
  const { data: badPromo } = await anon.rpc('validate_promo', { p_code: 'INEXISTANT' })
  check('code invalide -> null', badPromo === null)

  const browser = await chromium.launch({ channel: 'chromium' })
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
  const found = await page.getByText(/Test Check/).first().waitFor({ timeout: 12000 }).then(() => true).catch(() => false)
  check('bandeau campagne affiché sur la home', found)
  await browser.close()
  console.log(`\n=== ${failed === 0 ? 'TOUS' : JSON.stringify(failed)} PASS ===`)
} finally {
  if (testCampaignId) {
    const { error } = await api.from('campaigns').delete().eq('id', testCampaignId)
    console.log('   nettoyage campagne :', error ? error.message : 'OK')
  }
}
process.exit(failed ? 1 : 0)