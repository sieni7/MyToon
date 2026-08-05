import { ensureSession, signOut as supabaseSignOut } from '../lib/supabase'

export async function ensureLoggedIn() {
  return ensureSession()
}

export async function signOut() {
  await supabaseSignOut()
}
