// Crée le compte administrateur MyToon dans Supabase.
// Le SUPABASE_SECRET_KEY est requis en variable d'environnement (jamais dans le repo).
//
// Usage (PowerShell) :
//   $env:SUPABASE_URL="https://xgfageatdfugxeincfgc.supabase.co"
//   $env:SUPABASE_SECRET_KEY="sb_secret_..."
//   $env:ADMIN_EMAIL="ton@email.com"
//   $env:ADMIN_PASSWORD="un-mot-de-passe-fort"
//   node scripts/seed-admin.mjs
//
// Prérequis : la migration 0001/0002 doit être appliquée (SQL Editor).

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!url || !secret || !email || !password) {
  console.error('Manque SUPABASE_URL / SUPABASE_SECRET_KEY / ADMIN_EMAIL / ADMIN_PASSWORD')
  process.exit(1)
}

const admin = createClient(url, secret, { auth: { persistSession: false } })

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  console.error('Erreur création utilisateur :', error.message)
  process.exit(1)
}

const { error: adminError } = await admin
  .from('admins')
  .insert({ id: data.user.id, email })

if (adminError) {
  console.error('Erreur ajout au rôle admin :', adminError.message)
  process.exit(1)
}

console.log(`✅ Administrateur créé : ${email}`)
