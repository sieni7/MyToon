import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseUrl = url
export const supabase = url && key ? createClient(url, key) : null

export const MEDIA_BUCKET = 'media'

export async function getCurrentUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function ensureSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  if (data?.session) return data.session.user || null
  const { data: anon, error } = await supabase.auth.signInAnonymously()
  if (error) {
    // La session anonyme doit être activée dans le dashboard Supabase
    return null
  }
  return anon?.user || null
}

export async function signInAdmin(email, password) {
  if (!supabase) return { error: 'Supabase non configuré' }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { data, error: null }
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}
