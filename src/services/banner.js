import { supabase } from '../lib/supabase'

const KEY = 'promo'
const DEFAULT_BANNER = { text: '', active: false }

export async function getBanner() {
  if (!supabase) return { ...DEFAULT_BANNER }
  const { data } = await supabase.from('settings').select('value').eq('key', KEY).maybeSingle()
  return { ...DEFAULT_BANNER, ...(data?.value || {}) }
}

export async function setBanner(banner) {
  if (!supabase) return
  await supabase
    .from('settings')
    .upsert({ key: KEY, value: { ...DEFAULT_BANNER, ...banner } }, { onConflict: 'key' })
}
