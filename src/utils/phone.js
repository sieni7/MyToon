export function normalizePhone(p) {
  const digits = String(p || '').replace(/\D/g, '')
  if (digits.length === 13 && digits.startsWith('225')) return `+${digits}`
  if (digits.length === 10) return `+225${digits}`
  return digits ? `+${digits}` : ''
}