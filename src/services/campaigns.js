import { supabase } from '../lib/supabase'

export async function getActiveCampaign() {
  if (!supabase) return null
  const { data } = await supabase.rpc('get_active_campaign')
  return data || null
}

export async function validatePromo(code) {
  if (!supabase) return null
  const { data } = await supabase.rpc('validate_promo', { p_code: String(code || '').trim() })
  return data || null
}

export async function listCampaigns() {
  if (!supabase) return []
  const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function createCampaign(payload) {
  if (!supabase) return null
  const { data, error } = await supabase.from('campaigns').insert(payload).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateCampaign(id, payload) {
  if (!supabase) return null
  const { data, error } = await supabase.from('campaigns').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteCampaign(id) {
  if (!supabase) return
  const { error } = await supabase.from('campaigns').delete().eq('id', id)
  if (error) throw new Error(error.message)
}