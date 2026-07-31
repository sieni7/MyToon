const KEY = 'mytoon_promo_banner'

const DEFAULT_BANNER = { text: '', active: false }

export function getBanner() {
  try {
    return { ...DEFAULT_BANNER, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }
  } catch {
    return { ...DEFAULT_BANNER }
  }
}

export function setBanner(banner) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...DEFAULT_BANNER, ...banner }))
  } catch {
    // ignore
  }
}
