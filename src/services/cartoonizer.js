/**
 * Moteur de cartoonization client (Canvas API).
 * Aucun appel réseau — effet appliqué directement sur l'image dans le navigateur.
 *
 * Algorithmes utilisés par style :
 *   manga   → seuil adaptatif + contours noirs + demi-teintes
 *   comics  → quantification couleur + saturation + contours marqués
 *   cartoon → lissage bilatéral simplifié + couleurs vives
 *   pop-art → séparation 4 couleurs façon Warhol
 *   sketch  → esquisse au crayon (dodge + flou gaussien)
 */

/**
 * Applique l'effet cartoon à une image et retourne l'URL du résultat.
 *
 * @param {string} imageUrl  - URL (data: ou blob:) de l'image source
 * @param {string} styleId   - Identifiant du style (manga, comics, ...)
 * @returns {Promise<string>} URL blob de l'image transformée
 */
export async function cartoonizeLocal(imageUrl, styleId) {
  const img = await loadImage(imageUrl)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = img.width
  canvas.height = img.height

  ctx.drawImage(img, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  switch (styleId) {
    case 'manga':
      applyManga(imageData)
      break
    case 'comics':
      applyComics(imageData)
      break
    case 'cartoon':
      applyCartoon(imageData)
      break
    case 'pop-art':
      applyPopArt(imageData, canvas.width, canvas.height)
      break
    case 'sketch':
      applySketch(ctx, canvas.width, canvas.height)
      break
    default:
      applyCartoon(imageData)
  }

  // Les styles sketch et pop-art gèrent leur propre rendu
  if (styleId !== 'sketch' && styleId !== 'pop-art') {
    ctx.putImageData(imageData, 0, 0)
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob))
    }, 'image/jpeg', 0.85)
  })
}

// ============================================================
// Utilitaires
// ============================================================

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Impossible de charger l\'image'))
    img.src = url
  })
}

function clamp(v, min = 0, max = 255) {
  return v < min ? min : v > max ? max : v
}

// ============================================================
// Style 1 : Manga
// ============================================================

function applyManga(data) {
  const len = data.data.length

  for (let i = 0; i < len; i += 4) {
    const r = data.data[i]
    const g = data.data[i + 1]
    const b = data.data[i + 2]

    // Désaturation + contraste fort
    let gray = r * 0.299 + g * 0.587 + b * 0.114
    gray = gray < 100 ? gray * 0.6 : gray > 180 ? 255 : gray * 1.4
    gray = clamp(gray)

    const v = gray
    data.data[i] = v
    data.data[i + 1] = v
    data.data[i + 2] = clamp(gray * 0.85) // léger ton bleu/froid
  }

  // Renforcement des contours (Sobel simplifié)
  const width = data.width
  const pixels = new Uint8ClampedArray(data.data)
  const h = data.height

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4
      const gx = pixels[(y - 1) * width + (x + 1)] - pixels[(y - 1) * width + (x - 1)]
                + 2 * pixels[y * width + (x + 1)] - 2 * pixels[y * width + (x - 1)]
                + pixels[(y + 1) * width + (x + 1)] - pixels[(y + 1) * width + (x - 1)]
      const gy = pixels[(y + 1) * width + (x - 1)] - pixels[(y - 1) * width + (x - 1)]
                + 2 * pixels[(y + 1) * width + x] - 2 * pixels[(y - 1) * width + x]
                + pixels[(y + 1) * width + (x + 1)] - pixels[(y - 1) * width + (x + 1)]

      const edge = Math.sqrt(gx * gx + gy * gy)
      if (edge > 80) {
        data.data[idx] = 10
        data.data[idx + 1] = 10
        data.data[idx + 2] = 15
      }
    }
  }
}

// ============================================================
// Style 2 : Comics (Pop Art / Halftone)
// ============================================================

function applyComics(data) {
  const len = data.data.length

  for (let i = 0; i < len; i += 4) {
    let r = data.data[i]
    let g = data.data[i + 1]
    let b = data.data[i + 2]

    // Quantification à 8 paliers par canal
    r = Math.round(r / 32) * 32
    g = Math.round(g / 32) * 32
    b = Math.round(b / 32) * 32

    // Saturation boostée
    const gray = r * 0.299 + g * 0.587 + b * 0.114
    r = clamp(r + (r - gray) * 0.8)
    g = clamp(g + (g - gray) * 0.8)
    b = clamp(b + (b - gray) * 0.8)

    // Contraste renforcé
    data.data[i] = r < 128 ? r * 0.8 : clamp(r * 1.2)
    data.data[i + 1] = g < 128 ? g * 0.8 : clamp(g * 1.2)
    data.data[i + 2] = b < 128 ? b * 0.8 : clamp(b * 1.2)
  }
}

// ============================================================
// Style 3 : Cartoon (lissé, couleurs vives)
// ============================================================

function applyCartoon(data) {
  const w = data.width
  const h = data.height
  const pixels = new Uint8ClampedArray(data.data)

  // Filtre médian 3x3 simplifié (lissage)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const neighbors = []
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * w + (x + kx)) * 4
          neighbors.push(pixels[idx] * 0.299 + pixels[idx + 1] * 0.587 + pixels[idx + 2] * 0.114)
        }
      }
      neighbors.sort((a, b) => a - b)
      const median = neighbors[4]
      const idx = (y * w + x) * 4

      // Quantification + saturation
      let r = pixels[idx]
      let g = pixels[idx + 1]
      let b = pixels[idx + 2]
      const gray = r * 0.299 + g * 0.587 + b * 0.114

      // Si proche du median, on lisse
      if (Math.abs(gray - median) < 30) {
        r = (r + neighbors[4] * 0.3) / 1.3
        g = (g + neighbors[4] * 0.3) / 1.3
        b = (b + neighbors[4] * 0.3) / 1.3
      }

      // Quantification
      data.data[idx] = clamp(Math.round(r / 24) * 24)
      data.data[idx + 1] = clamp(Math.round(g / 24) * 24)
      data.data[idx + 2] = clamp(Math.round(b / 24) * 24)
    }
  }
}

// ============================================================
// Style 4 : Pop Art (Warhol — 4 quadrants colorés)
// ============================================================

function applyPopArt(ctx, width, height) {
  const qw = Math.floor(width / 2)
  const qh = Math.floor(height / 2)

  const imageData = ctx.getImageData(0, 0, width, height)
  const orig = new Uint8ClampedArray(imageData.data)

  const colorMaps = [
    { r: 1.4, g: 0.2, b: 0.2 }, // Rouge
    { r: 0.2, g: 1.2, b: 0.2 }, // Vert
    { r: 0.2, g: 0.2, b: 1.6 }, // Bleu
    { r: 1.6, g: 1.2, b: 0.2 }, // Jaune
  ]

  const quadrants = [
    { sx: 0, sy: 0, dx: 0, dy: 0 },
    { sx: qw, sy: 0, dx: qw, dy: 0 },
    { sx: 0, sy: qh, dx: 0, dy: qh },
    { sx: qw, sy: qh, dx: qw, dy: qh },
  ]

  for (let q = 0; q < 4; q++) {
    const map = colorMaps[q]
    const quad = quadrants[q]
    const imgData = ctx.createImageData(qw, qh)

    for (let y = 0; y < qh; y++) {
      for (let x = 0; x < qw; x++) {
        const sx = x + quad.sx
        const sy = y + quad.sy
        if (sx >= width || sy >= height) continue

        const si = (sy * width + sx) * 4
        const di = (y * qw + x) * 4
        const gray = orig[si] * 0.299 + orig[si + 1] * 0.587 + orig[si + 2] * 0.114
        const val = gray > 128 ? 230 : 40

        imgData.data[di] = clamp(val * map.r)
        imgData.data[di + 1] = clamp(val * map.g)
        imgData.data[di + 2] = clamp(val * map.b)
        imgData.data[di + 3] = orig[si + 3]
      }
    }

    ctx.putImageData(imgData, quad.dx, quad.dy)
  }
}

// ============================================================
// Style 5 : Sketch (esquisse crayon)
// ============================================================

function applySketch(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const len = data.length

  // 1. Désaturation
  for (let i = 0; i < len; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray
  }

  // 2. Inversion
  for (let i = 0; i < len; i += 4) {
    data[i] = 255 - data[i]
    data[i + 1] = 255 - data[i + 1]
    data[i + 2] = 255 - data[i + 2]
  }

  ctx.putImageData(imageData, 0, 0)

  // 3. Flou gaussien (boîte 3x3 simplifiée)
  const blurred = ctx.getImageData(0, 0, width, height)
  const blurData = blurred.data
  const w = width
  const h = height

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sum = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          sum += blurData[((y + ky) * w + (x + kx)) * 4]
        }
      }
      blurData[(y * w + x) * 4] = sum / 9
      blurData[(y * w + x) * 4 + 1] = sum / 9
      blurData[(y * w + x) * 4 + 2] = sum / 9
    }
  }

  ctx.putImageData(blurred, 0, 0)

  // 4. Dodge blend (effet crayon)
  const origData = ctx.getImageData(0, 0, width, height)
  const result = ctx.createImageData(width, height)

  for (let i = 0; i < result.data.length; i += 4) {
    const orig = data[i]
    const blur = origData.data[i]
    const dodge = blur === 255 ? 255 : Math.min(255, (orig << 8) / (255 - blur))
    result.data[i] = clamp(dodge + 30)
    result.data[i + 1] = clamp(dodge + 30)
    result.data[i + 2] = clamp(dodge + 30)
    result.data[i + 3] = 255
  }

  ctx.putImageData(result, 0, 0)
}
