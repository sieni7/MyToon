const STORAGE_KEY = 'mytoon_orders'
const COUNTER_KEY = 'mytoon_order_counter'

export const STORAGE_LIMIT_BYTES = 4.5 * 1024 * 1024

function readCounter() {
  try {
    return Number(localStorage.getItem(COUNTER_KEY)) || 0
  } catch {
    return 0
  }
}

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function writeAll(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    return true
  } catch {
    return false
  }
}

export function getStorageUsage() {
  try {
    let bytes = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      bytes += (key.length + (localStorage.getItem(key) || '').length) * 2
    }
    return bytes
  } catch {
    return 0
  }
}

function nextId() {
  let n = readCounter() + 1
  const orders = readAll()
  let id
  do {
    id = `MT-${String(n).padStart(4, '0')}`
    n++
  } while (orders.some((o) => o.id === id))
  try {
    localStorage.setItem(COUNTER_KEY, String(n - 1))
  } catch {
    // ignore
  }
  return id
}

export function createOrder({ client, product, avatar, photoDataUrl, options }) {
  const order = {
    id: nextId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client,
    product,
    avatar,
    photoDataUrl: photoDataUrl || null,
    options: options || { size: null, color: null },
    status: 'recue',
    timeline: [{ status: 'recue', date: new Date().toISOString(), note: 'Commande enregistrée' }],
    variations: [],
    chosenVariation: null,
    printerId: null,
  }
  const orders = readAll()
  orders.unshift(order)
  const saved = writeAll(orders)
  return { order, saved }
}

export function getOrder(id) {
  const normalized = String(id || '').trim().toUpperCase()
  return readAll().find((o) => o.id === normalized) || null
}

export function listOrders() {
  return readAll()
}

function normalizePhone(p) {
  return String(p || '').replace(/\D/g, '').slice(-9)
}

export function isOrderOwner(order, phone) {
  if (!order || !phone) return false
  return normalizePhone(order.client?.telephone) === normalizePhone(phone)
}

export function listOrdersByPhone(phone) {
  const normalized = normalizePhone(phone)
  if (!normalized) return []
  return readAll().filter((o) => normalizePhone(o.client?.telephone) === normalized)
}

export function updateStatus(id, status, note = '') {
  const orders = readAll()
  const order = orders.find((o) => o.id === id)
  if (!order) return null
  order.status = status
  order.updatedAt = new Date().toISOString()
  order.timeline.push({ status, date: new Date().toISOString(), note })
  writeAll(orders)
  return order
}

export function setVariations(id, variations) {
  const orders = readAll()
  const order = orders.find((o) => o.id === id)
  if (!order) return null
  order.variations = variations
  order.status = 'propositions_pretes'
  order.updatedAt = new Date().toISOString()
  order.timeline.push({ status: 'propositions_pretes', date: new Date().toISOString(), note: '3 déclinaisons ajoutées' })
  writeAll(orders)
  return order
}

export function chooseVariation(id, variationIndex) {
  const orders = readAll()
  const order = orders.find((o) => o.id === id)
  if (!order) return null
  order.chosenVariation = order.variations[variationIndex] || null
  order.status = 'validee'
  order.updatedAt = new Date().toISOString()
  order.timeline.push({ status: 'validee', date: new Date().toISOString(), note: 'Déclinaison validée par le client' })
  writeAll(orders)
  return order
}

export function assignPrinter(id, printerId) {
  const orders = readAll()
  const order = orders.find((o) => o.id === id)
  if (!order) return null
  order.printerId = printerId || null
  writeAll(orders)
  return order
}

export function createReorder(order) {
  const { order: created } = createOrder({
    client: { ...order.client },
    product: { ...order.product },
    avatar: { ...order.avatar },
    photoDataUrl: order.photoDataUrl,
    options: { ...(order.options || {}) },
  })
  return created
}
