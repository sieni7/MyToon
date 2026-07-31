import { getCurrentUser, ensureSession, signOut as supabaseSignOut } from '../lib/supabase'

export async function isLoggedIn() {
  return !!(await getCurrentUser())
}

export async function ensureLoggedIn() {
  return ensureSession()
}

export async function currentUserId() {
  const user = await getCurrentUser()
  return user ? user.id : null
}

export async function signOut() {
  await supabaseSignOut()
}
