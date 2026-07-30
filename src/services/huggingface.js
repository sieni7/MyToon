/**
 * Service d'appel à l'API Inference de Hugging Face.
 *
 * Modèle utilisé : instruction-tuning-sd/cartoonizer
 * (Stable Diffusion + InstructPix2Pix fine-tuné pour la cartoonization)
 *
 * Contournement DNS (Côte d'Ivoire) :
 *   - En dev : passe par le proxy Vite (vite.config.js → /hf-api/)
 *     Le navigateur appelle localhost:5173, Vite relaie vers HF
 *   - En prod : appelle directement l'API HF
 *     (Netlify résout le DNS sans problème)
 *
 * Prérequis :
 *   1. Token gratuit : https://huggingface.co/settings/tokens
 *   2. Copier le token dans .env.local :
 *      VITE_HF_TOKEN=hf_votre_token
 */

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN
const MODEL_ID = 'instruction-tuning-sd/cartoonizer'

/**
 * Construit l'URL cible selon l'environnement.
 * - DEV  → Vite proxy local (contourne DNS + CORS)
 * - PROD → API directe (Netlify résout correctement)
 */
function apiUrl() {
  const path = `/models/${MODEL_ID}`
  return import.meta.env.DEV ? `/hf-api${path}` : `https://api-inference.huggingface.co${path}`
}

/**
 * Prompts associés à chaque style MyToon.
 * Le modèle InstructPix2Pix utilise ces instructions pour guider la transformation.
 */
export const STYLE_PROMPTS = {
  manga:
    'Cartoonize this photo into a manga style, bold black outlines, anime eyes, dramatic shading, high contrast, Japanese comic art',
  comics:
    'Cartoonize this photo into a comic book style, vibrant colors, halftone dots, bold inking, pop art, superhero comic',
  cartoon:
    'Cartoonize this photo into a cartoon, exaggerated features, big eyes, playful, funny, Pixar style',
  'pop-art':
    'Cartoonize this photo into pop art, Andy Warhol style, vibrant contrasting colors, silkscreen effect, retro',
  sketch:
    'Cartoonize this photo into a pencil sketch, hand-drawn look, graphite texture, artistic shading, black and white',
}

/**
 * Transforme une image via Hugging Face Inference API.
 *
 * @param {File|Blob} imageBlob        - Image à transformer
 * @param {string}    prompt           - Instruction texte (voir STYLE_PROMPTS)
 * @param {object}    [options]
 * @param {number}    [options.retries=2]  - Tentatives (pour cold start 503)
 * @param {number}    [options.timeout=90000] - Timeout max par tentative (ms)
 * @returns {Promise<string>} URL blob de l'image transformée
 */
export async function cartoonizeImage(imageBlob, prompt, { retries = 2, timeout = 90000 } = {}) {
  if (!HF_TOKEN) {
    throw new Error(
      'Token Hugging Face manquant. Crée .env.local avec VITE_HF_TOKEN=hf_...'
    )
  }

  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(apiUrl(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: await blobToBase64(imageBlob),
          parameters: {
            prompt,
            negative_prompt: 'photorealistic, 3d render, low quality, blurry',
          },
        }),
        signal: controller.signal,
      })

      clearTimeout(timer)

      if (!response.ok) {
        const text = await response.text()

        // 503 = modèle en cours de chargement (cold start) → on retry
        if (response.status === 503 && attempt < retries) {
          const wait = (attempt + 1) * 5000
          console.warn(`[HF] Cold start, nouvelle tentative dans ${wait / 1000}s...`)
          await sleep(wait)
          continue
        }

        throw new Error(`HF API (${response.status}) : ${text.slice(0, 200)}`)
      }

      const blob = await response.blob()

      if (!blob.type.startsWith('image/')) {
        throw new Error(`Réponse inattendue : ${blob.type}`)
      }

      return URL.createObjectURL(blob)
    } catch (err) {
      lastError = err
      if (err.name === 'AbortError') {
        throw new Error('Timeout : le modèle n\'a pas répondu dans les 90s')
      }
      if (attempt < retries) {
        console.warn(`[HF] Tentative ${attempt + 1}/${retries + 1} échouée`)
        await sleep(2000)
      }
    }
  }

  throw lastError || new Error('Échec de la cartoonization après toutes les tentatives')
}

/**
 * Convertit un Blob/File en base64 (sans le préfixe data:image/...).
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      resolve(typeof result === 'string' ? result.split(',')[1] || result : result)
    }
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
    reader.readAsDataURL(blob)
  })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
