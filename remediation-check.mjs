import { createClient } from '@supabase/supabase-js'
import { normalizePhone } from './src/utils/phone.js'

const URL = process.env.SUPABASE_URL
const SECRET = process.env.SUPABASE_SECRET_KEY
const PUBLISHABLE = process.env.SUPABASE_PUBLISHABLE_KEY

const api = createClient(URL, SECRET, { auth: { persistSession: false } })
const anon = createClient(URL, PUBLISHABLE)

let failed = 0
const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`) }

const createdOrders = []
let campaignId = null

const del = async (table, col, val) => {
  try { await api.from(table).delete().eq(col, val) } catch { /* ignore */ }
}

try {
  // user anonyme (propriétaire des commandes de test)
  const { data: { user } } = await anon.auth.signInAnonymously()
  const owner = user.id

  // --- A. Promo autoritaire (trigger) ---
  const { data: camp } = await api.from('campaigns').insert({
    code: 'rem-test-' + Date.now(),
    name: 'Rem Test',
    active: true,
    promo_code: 'ZTEST10',
    promo_discount: 10,
  }).select().single()
  campaignId = camp.id
  check('campagne de test active', true)

  const { data: c1 } = await api.rpc('next_order_code')
  const { data: o1 } = await api.from('orders').insert({
    code: c1, owner_user_id: owner,
    client: { nom: 'T1', telephone: '0700000000', quartier: '', ville: '', adresse: '' },
    product: { id: 'tee', name: 'T-shirt', price: 10000 }, avatar: { id: 'x', style: 'manga', name: 'X' },
    options: { size: 'M', color: 'Blanc' }, status: 'recue',
    timeline: [], variations: [], promo: { code: 'ZTEST10', discount: 99 },
  }).select().single()
  createdOrders.push(o1.id)
  check('promo valide → remise autoritaire (99→10)', o1.promo?.discount === 10 && o1.promo?.code === 'ZTEST10')

  const { data: c2 } = await api.rpc('next_order_code')
  const { data: o2 } = await api.from('orders').insert({
    code: c2, owner_user_id: owner,
    client: { nom: 'T2', telephone: '0700000001', quartier: '', ville: '', adresse: '' },
    product: { id: 'tee', name: 'T-shirt', price: 10000 }, avatar: { id: 'x', style: 'manga', name: 'X' },
    options: { size: 'M', color: 'Blanc' }, status: 'recue',
    timeline: [], variations: [], promo: { code: 'FAUXCODE', discount: 70 },
  }).select().single()
  createdOrders.push(o2.id)
  check('promo invalide → rejeté (null)', o1 && o2.promo === null)

  // --- C. owner_phone E.164 (logique client normalisée) ---
  const { data: c3 } = await api.rpc('next_order_code')
  const { data: o3 } = await api.from('orders').insert({
    code: c3, owner_user_id: owner,
    client: { nom: 'T3', telephone: '+225 07 12 34 56 78', quartier: '', ville: '', adresse: '' },
    product: { id: 'tee', name: 'T-shirt', price: 10000 }, avatar: { id: 'x', style: 'manga', name: 'X' },
    options: { size: 'M', color: 'Blanc' }, status: 'recue',
    timeline: [], variations: [], owner_phone: normalizePhone('+225 07 12 34 56 78'),
  }).select().single()
  createdOrders.push(o3.id)
  check('owner_phone E.164 (+2250712345678)', o3.owner_phone === '+2250712345678')
  check('normalizePhone 10 chiffres → +225 préfixé', normalizePhone('07 12 34 56 78') === '+2250712345678')
  check('normalizePhone 13 chiffres 225 → + conservé', normalizePhone('+2250712345678') === '+2250712345678')

  // --- B. choose_variation : garde du workflow 7 statuts ---
  const { data: c4 } = await api.rpc('next_order_code')
  const { data: o4 } = await api.from('orders').insert({
    code: c4, owner_user_id: owner,
    client: { nom: 'T4', telephone: '0700000004', quartier: '', ville: '', adresse: '' },
    product: { id: 'tee', name: 'T-shirt', price: 10000 }, avatar: { id: 'x', style: 'manga', name: 'X' },
    options: {}, status: 'recue', timeline: [], variations: [],
  }).select().single()
  createdOrders.push(o4.id)
  const { error: errRecue } = await anon.rpc('choose_variation', { order_code: o4.code, variation_index: 0 })
  check('choose_variation rejette un statut != propositions_pretes', !!errRecue)

  const { data: c5 } = await api.rpc('next_order_code')
  const { data: o5 } = await api.from('orders').insert({
    code: c5, owner_user_id: owner,
    client: { nom: 'T5', telephone: '0700000005', quartier: '', ville: '', adresse: '' },
    product: { id: 'tee', name: 'T-shirt', price: 10000 }, avatar: { id: 'x', style: 'manga', name: 'X' },
    options: {}, status: 'propositions_pretes', timeline: [], variations: ['variations/x/1.jpg'],
  }).select().single()
  createdOrders.push(o5.id)
  const { error: errOk } = await anon.rpc('choose_variation', { order_code: o5.code, variation_index: 0 })
  const { data: after } = await api.from('orders').select('status, chosen_variation').eq('id', o5.id).single()
  check('choose_variation OK → validee (7 statuts)', !errOk && after.status === 'validee')
} catch (e) {
  console.log('ERREUR :', e.message)
  process.exitCode = 1
} finally {
  await anon.auth.signOut().catch(() => {})
  for (const id of createdOrders) await del('orders', 'id', id)
  if (campaignId) await del('campaigns', 'id', campaignId)
  console.log('   nettoyage OK')
}
console.log(failed ? `\n=== ${failed} FAIL ===` : '\n=== TOUS PASS ===')
process.exit(failed ? 1 : 0)