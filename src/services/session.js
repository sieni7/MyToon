const KEY = 'mytoon_client_phone'

export function login(phone) {
  try {
    localStorage.setItem(KEY, phone)
  } catch {
    // ignore
  }
}

export function logout() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function getSessionPhone() {
  try {
    return localStorage.getItem(KEY) || null
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return !!getSessionPhone()
}

export function validateCode(code) {
  return /^\d{4}$/.test(code)
}
