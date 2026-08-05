import { supabase, MEDIA_BUCKET, ensureSession, getCurrentUser } from '../lib/supabase'

function normalizePhone(p) {
  return String(p || '').replace(/\D/g, '').slice(-9)
}

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

async function requireUser() {
  const user = await ensureSession()
  if (!user) {
    throw new Error("Connexion indisponible. Active la session anonyme dans le dashboard Supabase (Auth → Providers → Anonymous).")
  }
  return user
}

export async function createOrder({ client, product, avatar, photoFile, photoPath, options, promo }) {
  const user = await requireUser()

  const { data: code, error: codeError } = await supabase.rpc('next_order_code')
  if (codeError || !code) throw new Error('Impossible de générer le numéro de commande')

  let finalPhotoPath = photoPath || null
  if (!finalPhotoPath && photoFile) {
    const ext = (photoFile.name || 'photo.jpg').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    finalPhotoPath = `photos/${user.id}/${uid()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(finalPhotoPath, photoFile, { cacheControl: '3600', upsert: false })
    if (uploadError) throw new Error('Échec de l\'envoi de la photo. Réessaie avec une image plus légère.')
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      code,
      owner_user_id: user.id,
      owner_phone: normalizePhone(client.telephone),
      client,
      product,
      avatar,
      options: options || { size: null, color: null },
      photo_path: finalPhotoPath,
      status: 'recue',
      timeline: [{ status: 'recue', date: new Date().toISOString(), note: 'Commande enregistrée' }],
      variations: [],
      chosen_variation: null,
      printer_id: null,
      promo: promo || null,
    })
    .select()
    .single()
  if (error) throw new Error('Impossible d\'enregistrer la commande : ' + error.message)
  return data
}

export async function getOrder(code) {
  if (!supabase) return null
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('code', String(code || '').trim().toUpperCase())
    .maybeSingle()
  return data || null
}

export async function listMyOrders() {
  const user = await getCurrentUser()
  if (!user) return []
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('owner_user_id', user.id)
    .order('created_at', { ascending: false })
  return data || []
}

export async function listOrders() {
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function getOrderStats() {
  if (!supabase) return null
  const { data } = await supabase.rpc('order_stats')
  return data || null
}

export async function getRecentFeed() {
  if (!supabase) return []
  const { data } = await supabase.rpc('recent_feed')
  return Array.isArray(data) ? data : []
}

export async function isAdmin() {
  const user = await getCurrentUser()
  if (!user) return false
  const { data } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle()
  return !!data
}

export async function updateStatus(code, status, note = '') {
  const order = await getOrder(code)
  if (!order) return null
  const timeline = [...(order.timeline || []), { status, date: new Date().toISOString(), note }]
  const { data, error } = await supabase
    .from('orders')
    .update({ status, timeline, updated_at: new Date().toISOString() })
    .eq('code', code)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function setVariations(code, files) {
  const order = await getOrder(code)
  if (!order || !files || files.length === 0) return null
  const paths = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const ext = (file.name || 'v.jpg').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const path = `variations/${order.code}/${i + 1}.${ext}`
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { upsert: true })
    if (error) throw new Error('Échec de l\'envoi d\'une déclinaison')
    paths.push(path)
  }
  const timeline = [...(order.timeline || []), { status: 'propositions_pretes', date: new Date().toISOString(), note: '3 déclinaisons ajoutées' }]
  const { data, error } = await supabase
    .from('orders')
    .update({ variations: paths, status: 'propositions_pretes', timeline, updated_at: new Date().toISOString() })
    .eq('code', order.code)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function chooseVariation(code, index) {
  const { error } = await supabase.rpc('choose_variation', { order_code: code, variation_index: index })
  if (error) throw new Error(error.message)
  return getOrder(code)
}

export async function assignPrinter(code, printerId) {
  const { data, error } = await supabase
    .from('orders')
    .update({ printer_id: printerId || null, updated_at: new Date().toISOString() })
    .eq('code', code)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createReorder(order) {
  return createOrder({
    client: { ...order.client },
    product: { ...order.product },
    avatar: { ...order.avatar },
    options: { ...(order.options || {}) },
    photoPath: order.photo_path || undefined,
  })
}
