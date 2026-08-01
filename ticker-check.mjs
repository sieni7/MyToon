import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const URL = process.env.SUPABASE_URL
const SECRET = process.env.SUPABASE_SECRET_KEY
const api = createClient(URL, SECRET, { auth: { persistSession: false } })

const codes = []
try {
  for (const c of [
    { nom: 'Awa Koné', quartier: 'Yopougon', style: 'manga', status: 'validee' },
    { nom: 'Arnaud K.', quartier: 'Cocody', style: 'comics', status: 'propositions_pretes' },
  ]) {
    const { data: code } = await api.rpc('next_order_code')
    const { error } = await api.from('orders').insert({
      code,
      owner_user_id: null,
      owner_phone: '0700000000',
      client: { nom: c.nom, telephone: '07 00 00 00 00', quartier: c.quartier, ville: 'Abidjan', adresse: '' },
      product: { id: 'tee', name: 'T-shirt coton local', price: 10000 },
      avatar: { id: 'manga-01', style: c.style, name: 'Toon' },
      options: { size: 'M', color: 'Blanc' },
      photo_path: null,
      status: c.status,
      timeline: [{ status: c.status, date: new Date().toISOString(), note: 'seed test' }],
      variations: [],
    })
    if (error) throw new Error(error.message)
    codes.push(code)
  }

  const { data: feed } = await api.rpc('recent_feed')
  console.log('FEED RPC:', JSON.stringify(feed))

  const browser = await chromium.launch({ channel: 'chromium' })
  const page = await browser.newPage()
  const r = []
  const check = (label, ok) => { r.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`) }

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
  await page.getByText('En direct').waitFor({ timeout: 15000 })
  check('ticker « En direct » visible', true)
  await page.getByText(/Awa a validé son toon/).waitFor({ timeout: 10000 })
  check('message ticker (Awa · Yopougon · Manga)', true)
  check('quartier affiché', await page.getByText(/à Yopougon/).first().isVisible().catch(() => false))

  await browser.close()
  const failed = r.filter((v) => !v).length
  console.log(`\n=== ${r.length - failed}/${r.length} PASS ===`)
  if (failed) process.exitCode = 1
} finally {
  if (codes.length) {
    const { error } = await api.from('orders').delete().in('code', codes)
    console.log('   nettoyage seed :', error ? error.message : 'OK')
  }
}
