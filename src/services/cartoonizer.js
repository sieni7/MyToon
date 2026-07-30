/**
 * Moteur de cartoonization client (Canvas API v2).
 * Pipeline multicouche avec rendu de qualité professionnelle.
 *
 * Pipeline générique :
 *   1. Lissage bilatéral (contours préservés, surfaces lisses)
 *   2. Quantification couleur (palette réduite)
 *   3. Détection de contours (Sobel)
 *   4. Composition (surfaces + contours)
 *   5. Post-processing spécifique au style
 */

/**
 * Applique l'effet cartoon à une image.
 *
 * @param {string} imageUrl - URL de l'image source
 * @param {string} styleId  - manga | comics | cartoon | pop-art | sketch
 * @returns {Promise<string>} URL blob du résultat
 */
export async function cartoonizeLocal(imageUrl, styleId) {
  const img = await loadImage(imageUrl)
  const w = img.width
  const h = img.height

  // Étape 1 : image de base
  const base = createCanvas(w, h)
  base.ctx.drawImage(img, 0, 0)

  // Cache l'image source normalisée
  const srcData = base.ctx.getImageData(0, 0, w, h)
  const srcPixels = new Uint8ClampedArray(srcData.data)

  switch (styleId) {
    case 'manga':
      return processManga(srcPixels, w, h, base.canvas)
    case 'comics':
      return processComics(srcPixels, w, h, base.canvas)
    case 'cartoon':
      return processCartoon(srcPixels, w, h, base.canvas)
    case 'pop-art':
      return processPopArt(srcPixels, w, h, base.canvas)
    case 'sketch':
      return processSketch(srcPixels, w, h, base.canvas)
    default:
      return processCartoon(srcPixels, w, h, base.canvas)
  }
}

// ============================================================
// Utilitaires
// ============================================================

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Impossible de charger l'image"))
    img.src = url
  })
}

function createCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  return { canvas, ctx }
}

function clonePixels(src) {
  return new Uint8ClampedArray(src)
}

function clamp(v, min = 0, max = 255) {
  return v < min ? min : v > max ? max : Math.round(v)
}

function gray(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114
}

function toBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob)), 'image/jpeg', 0.92)
  })
}

// ============================================================
// Pipeline générique : lissage + quantification + contours
// ============================================================

/**
 * Applique un lissage bilatéral simplifié.
 * Préserve les contours tout en lissant les surfaces.
 */
function bilateralSmooth(pixels, w, h, spatialSigma = 2, rangeSigma = 30) {
  const out = clonePixels(pixels)
  const radius = spatialSigma
  const rangeNorm = 1 / (2 * rangeSigma * rangeSigma)

  for (let y = radius; y < h - radius; y++) {
    for (let x = radius; x < w - radius; x++) {
      const idx = (y * w + x) * 4
      let rW = 0, sumR = 0, sumG = 0, sumB = 0
      const cR = pixels[idx], cG = pixels[idx + 1], cB = pixels[idx + 2]

      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const nIdx = ((y + ky) * w + (x + kx)) * 4
          const nR = pixels[nIdx], nG = pixels[nIdx + 1], nB = pixels[nIdx + 2]
          const spatialW = Math.exp(-(kx * kx + ky * ky) / (2 * spatialSigma * spatialSigma))
          const colorDist = (cR - nR) ** 2 + (cG - nG) ** 2 + (cB - nB) ** 2
          const rangeW = Math.exp(-colorDist * rangeNorm)
          const weight = spatialW * rangeW
          rW += weight
          sumR += nR * weight
          sumG += nG * weight
          sumB += nB * weight
        }
      }

      out[idx] = clamp(sumR / rW)
      out[idx + 1] = clamp(sumG / rW)
      out[idx + 2] = clamp(sumB / rW)
    }
  }

  return out
}

/**
 * Quantifie les couleurs d'une image (posterize).
 */
function quantize(pixels, levels) {
  const step = 255 / (levels - 1)
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = clamp(Math.round(pixels[i] / step) * step)
    pixels[i + 1] = clamp(Math.round(pixels[i + 1] / step) * step)
    pixels[i + 2] = clamp(Math.round(pixels[i + 2] / step) * step)
  }
  return pixels
}

/**
 * Détection de contours Sobel. Retourne un ImageData de contours.
 * Les pixels brillants = contours forts.
 */
function detectEdges(pixels, w, h) {
  const grayPixels = new Float32Array(w * h)
  for (let i = 0; i < pixels.length; i += 4) {
    grayPixels[i / 4] = gray(pixels[i], pixels[i + 1], pixels[i + 2])
  }

  const edgeData = new Uint8ClampedArray(w * h * 4)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x
      const gx =
        -grayPixels[(y - 1) * w + (x - 1)] + grayPixels[(y - 1) * w + (x + 1)]
        + -2 * grayPixels[y * w + (x - 1)] + 2 * grayPixels[y * w + (x + 1)]
        + -grayPixels[(y + 1) * w + (x - 1)] + grayPixels[(y + 1) * w + (x + 1)]
      const gy =
        -grayPixels[(y - 1) * w + (x - 1)] + -2 * grayPixels[(y - 1) * w + x] + -grayPixels[(y - 1) * w + (x + 1)]
        + grayPixels[(y + 1) * w + (x - 1)] + 2 * grayPixels[(y + 1) * w + x] + grayPixels[(y + 1) * w + (x + 1)]
      const mag = Math.sqrt(gx * gx + gy * gy)
      const v = clamp(mag)
      const di = idx * 4
      edgeData[di] = v
      edgeData[di + 1] = v
      edgeData[di + 2] = v
      edgeData[di + 3] = 255
    }
  }
  return edgeData
}

/**
 * Compose l'image quantifiée avec les contours noirs.
 */
function composeWithEdges(canvas, ctx, quantizedData, edgeData, w, h, edgeThreshold = 60) {
  ctx.putImageData(quantizedData, 0, 0)

  // Effacement sélectif : on ne garde que les pixels de contour
  const edgeCanvas = createCanvas(w, h)
  edgeCanvas.ctx.putImageData(new ImageData(edgeData, w, h), 0, 0)

  // Seuil : ne garder que les contours marqués
  const edgeImageData = edgeCanvas.ctx.getImageData(0, 0, w, h)
  const ed = edgeImageData.data
  for (let i = 0; i < ed.length; i += 4) {
    const edgeVal = ed[i]
    ed[i] = 0
    ed[i + 1] = 0
    ed[i + 2] = 0
    if (edgeVal < edgeThreshold) {
      ed[i + 3] = 0
    } else {
      ed[i + 3] = clamp(edgeVal * 1.5, 0, 200)
    }
  }
  edgeCanvas.ctx.putImageData(edgeImageData, 0, 0)

  // Composer les contours par-dessus
  ctx.drawImage(edgeCanvas.canvas, 0, 0)
}

// ============================================================
// Style 1 : Manga (haut contraste + traits noirs + demi-teintes)
// ============================================================

async function processManga(src, w, h, canvas) {
  const ctx = canvas.getContext('2d')

  // 1. Lissage
  const smooth = bilateralSmooth(src, w, h, 2, 25)

  // 2. Quantification agressive (4 niveaux → tons plats)
  quantize(smooth, 4)

  // 3. Désaturation + contraste
  for (let i = 0; i < smooth.length; i += 4) {
    const g = clamp(gray(smooth[i], smooth[i + 1], smooth[i + 2]))
    const contrasted = g < 90 ? g * 0.5 : g > 180 ? clamp(g * 1.3) : g
    smooth[i] = clamp(contrasted)
    smooth[i + 1] = clamp(contrasted * 0.92) // léger ton froid
    smooth[i + 2] = clamp(contrasted * 0.85)
  }

  const quantizedData = new ImageData(smooth, w, h)

  // 4. Contours Sobel (seuil bas → traits marqués)
  const edges = detectEdges(src, w, h)
  composeWithEdges(canvas, ctx, quantizedData, edges, w, h, 40)

  // 5. Post-processing : screen tone très léger
  addScreenTone(ctx, w, h, 0.03)

  return toBlob(canvas)
}

// ============================================================
// Style 2 : Comics (couleurs vives + halftone + contours)
// ============================================================

async function processComics(src, w, h, canvas) {
  const ctx = canvas.getContext('2d')

  // 1. Lissage
  const smooth = bilateralSmooth(src, w, h, 2, 30)

  // 2. Quantification 6 niveaux
  quantize(smooth, 6)

  // 3. Saturation boostée
  for (let i = 0; i < smooth.length; i += 4) {
    const g = gray(smooth[i], smooth[i + 1], smooth[i + 2])
    smooth[i] = clamp(smooth[i] + (smooth[i] - g) * 0.7)
    smooth[i + 1] = clamp(smooth[i + 1] + (smooth[i + 1] - g) * 0.7)
    smooth[i + 2] = clamp(smooth[i + 2] + (smooth[i + 2] - g) * 0.7)
    // Contraste boost
    smooth[i] = smooth[i] < 128 ? smooth[i] * 0.85 : clamp(smooth[i] * 1.15)
    smooth[i + 1] = smooth[i + 1] < 128 ? smooth[i + 1] * 0.85 : clamp(smooth[i + 1] * 1.15)
    smooth[i + 2] = smooth[i + 2] < 128 ? smooth[i + 2] * 0.85 : clamp(smooth[i + 2] * 1.15)
  }

  const quantizedData = new ImageData(smooth, w, h)

  // 4. Contours Sobel (seuil moyen)
  const edges = detectEdges(src, w, h)
  composeWithEdges(canvas, ctx, quantizedData, edges, w, h, 50)

  // 5. Halftone dots
  addHalftone(ctx, w, h, 0.06)

  return toBlob(canvas)
}

// ============================================================
// Style 3 : Cartoon (lissé + couleurs vives + contours doux)
// ============================================================

async function processCartoon(src, w, h, canvas) {
  const ctx = canvas.getContext('2d')

  // 1. Lissage fort
  const smooth = bilateralSmooth(src, w, h, 3, 20)

  // 2. Quantification 8 niveaux (couleurs plus riches)
  quantize(smooth, 8)

  // 3. Vibrance boost
  for (let i = 0; i < smooth.length; i += 4) {
    const g = gray(smooth[i], smooth[i + 1], smooth[i + 2])
    smooth[i] = clamp(smooth[i] + (smooth[i] - g) * 0.5)
    smooth[i + 1] = clamp(smooth[i + 1] + (smooth[i + 1] - g) * 0.5)
    smooth[i + 2] = clamp(smooth[i + 2] + (smooth[i + 2] - g) * 0.5)
  }

  const quantizedData = new ImageData(smooth, w, h)

  // 4. Contours Sobel (seuil haut → contours plus fins)
  const edges = detectEdges(src, w, h)
  composeWithEdges(canvas, ctx, quantizedData, edges, w, h, 60)

  return toBlob(canvas)
}

// ============================================================
// Style 4 : Pop Art (quadrants Warhol)
// ============================================================

async function processPopArt(src, w, h, canvas) {
  const ctx = canvas.getContext('2d')

  // 1. Lissage + quantification
  const smooth = bilateralSmooth(src, w, h, 2, 30)
  quantize(smooth, 4)

  // 2. Contours Sobel
  const edges = detectEdges(src, w, h)
  const quantizedData = new ImageData(smooth, w, h)
  composeWithEdges(canvas, ctx, quantizedData, edges, w, h, 50)

  // 3. Redécoupage en 4 quadrants avec filtres couleur
  const qw = Math.floor(w / 2)
  const qh = Math.floor(h / 2)
  const fullData = ctx.getImageData(0, 0, w, h)

  const colorMaps = [
    { r: 1.0, g: 0.1, b: 0.1 }, // Rouge vif
    { r: 0.1, g: 1.0, b: 0.3 }, // Vert
    { r: 0.1, g: 0.3, b: 1.0 }, // Bleu
    { r: 1.0, g: 0.9, b: 0.1 }, // Jaune
  ]

  const quads = [[0, 0], [qw, 0], [0, qh], [qw, qh]]

  for (let q = 0; q < 4; q++) {
    const [qx, qy] = quads[q]
    const map = colorMaps[q]
    const quadData = ctx.createImageData(qw, qh)

    for (let y = 0; y < qh; y++) {
      for (let x = 0; x < qw; x++) {
        const sx = x + qx
        const sy = y + qy
        if (sx >= w || sy >= h) continue
        const si = (sy * w + sx) * 4
        const di = (y * qw + x) * 4
        const g = gray(fullData.data[si], fullData.data[si + 1], fullData.data[si + 2])
        const brightness = g > 128 ? 230 : 30
        quadData.data[di] = clamp(brightness * map.r)
        quadData.data[di + 1] = clamp(brightness * map.g)
        quadData.data[di + 2] = clamp(brightness * map.b)
        quadData.data[di + 3] = 255
      }
    }

    ctx.putImageData(quadData, qx, qy)
  }

  // 4. Halftone overlay
  addHalftone(ctx, w, h, 0.08)

  return toBlob(canvas)
}

// ============================================================
// Style 5 : Sketch (esquisse crayon réaliste)
// ============================================================

async function processSketch(src, w, h, canvas) {
  const ctx = canvas.getContext('2d')

  // 1. Désaturation

  // On fait deux passes :
  // Passe A : version floutée (pour le dodge)
  // Passe B : version originale inversée

  const blurred = new Float32Array(w * h)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sum = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * w + (x + kx)) * 4
          sum += gray(src[idx], src[idx + 1], src[idx + 2])
        }
      }
      blurred[y * w + x] = sum / 9
    }
  }

  // Dodge blend : (inverted_original * 256) / (255 - blurred)
  const out = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    const gy = i * 4
    const g = gray(src[gy], src[gy + 1], src[gy + 2])
    const inverted = 255 - g
    const blurVal = blurred[i]
    const dodge = blurVal >= 254 ? 255 : Math.min(255, (inverted * 256) / (255 - blurVal))
    const v = clamp(dodge + 20)
    out[gy] = v
    out[gy + 1] = clamp(v * 0.95)
    out[gy + 2] = clamp(v * 0.9)
    out[gy + 3] = 255
  }

  ctx.putImageData(new ImageData(out, w, h), 0, 0)

  // Ajout d'un bruit léger pour l'effet papier
  addPaperTexture(ctx, w, h, 0.04)

  return toBlob(canvas)
}

// ============================================================
// Effets de texture
// ============================================================

function addScreenTone(ctx, w, h, opacity) {
  // Motif de trame manuelle
  const imgData = ctx.getImageData(0, 0, w, h)
  const d = imgData.data
  const spacing = 6
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cy = y % spacing, cx = x % spacing
      const dist = Math.sqrt((cx - spacing / 2) ** 2 + (cy - spacing / 2) ** 2)
      if (dist < 1.2) {
        const i = (y * w + x) * 4
        d[i] = clamp(d[i] * (1 - opacity))
        d[i + 1] = clamp(d[i + 1] * (1 - opacity))
        d[i + 2] = clamp(d[i + 2] * (1 - opacity))
      }
    }
  }
  ctx.putImageData(imgData, 0, 0)
}

function addHalftone(ctx, w, h, opacity) {
  const imgData = ctx.getImageData(0, 0, w, h)
  const d = imgData.data
  const spacing = 5
  for (let y = 0; y < h; y += spacing) {
    for (let x = 0; x < w; x += spacing) {
      const i = (y * w + x) * 4
      const avg = (d[i] + d[i + 1] + d[i + 2]) / 3
      // Cercle dont la taille varie avec la luminosité
      const radius = ((255 - avg) / 255) * (spacing / 2 - 0.5)
      for (let dy = -Math.ceil(radius); dy <= Math.ceil(radius); dy++) {
        for (let dx = -Math.ceil(radius); dx <= Math.ceil(radius); dx++) {
          if (dx * dx + dy * dy <= radius * radius) {
            const px = x + dx
            const py = y + dy
            if (px >= 0 && px < w && py >= 0 && py < h) {
              const pi = (py * w + px) * 4
              d[pi] = clamp(d[pi] * (1 - opacity * 0.5))
              d[pi + 1] = clamp(d[pi + 1] * (1 - opacity * 0.5))
              d[pi + 2] = clamp(d[pi + 2] * (1 - opacity * 0.5))
            }
          }
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0)
}

function addPaperTexture(ctx, w, h, opacity) {
  const imgData = ctx.getImageData(0, 0, w, h)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * opacity * 255
    d[i] = clamp(d[i] + noise)
    d[i + 1] = clamp(d[i + 1] + noise * 0.8)
    d[i + 2] = clamp(d[i + 2] + noise * 0.6)
  }
  ctx.putImageData(imgData, 0, 0)
}
