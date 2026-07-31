import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'chromium' })
const page = await browser.newPage()
const r = []
const check = (label, ok) => { r.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`) }

await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
await page.locator('#hero').waitFor({ timeout: 20000 })
await page.getByText(/héros à porter/).first().waitFor({ timeout: 10000 })
check('nouveau titre h1 (transformation)', true)
await page.locator('#hero svg').first().waitFor({ timeout: 10000 })
check('mockup t-shirt SVG présent', true)
await page.getByRole('button', { name: '📷 Photo' }).waitFor({ timeout: 10000 })
check('toggle Photo/Toon présent', true)
await page.locator('#hero').getByText('💳 Paiement à la livraison').waitFor({ timeout: 10000 })
check('badges de confiance présents', true)
await page.locator('#hero').getByRole('button', { name: '📖 Manga' }).waitFor({ timeout: 10000 })
check('carrousel de styles présent', true)
await page.locator('#hero').getByText('1h', { exact: true }).waitFor({ timeout: 10000 })
check('stat 1h présente', true)

await page.locator('#hero').getByRole('button', { name: '📖 Manga' }).click()
await page.waitForURL('**/commande?style=manga')
await page.getByText('1. Choisis ton style et ton avatar').waitFor({ timeout: 15000 })
check('redirection /commande?style=manga', true)
await page.getByRole('button', { name: /Continuer/ }).waitFor({ timeout: 10000 })
check('avatar présélectionné (Continuer actif)', await page.getByRole('button', { name: /Continuer/ }).isEnabled().catch(() => false))

await browser.close()
const failed = r.filter((v) => !v).length
console.log(`\n=== ${r.length - failed}/${r.length} PASS ===`)
process.exit(failed ? 1 : 0)
