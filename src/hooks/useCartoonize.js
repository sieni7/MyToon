import { useState, useRef, useCallback } from 'react'
import { cartoonizeLocal } from '../services/cartoonizer'

/**
 * Hook qui transforme une photo en avatar toon.
 *
 * Utilise le moteur Canvas local (cartoonizer.js) — zéro API, instantané.
 * Si Hugging Face devient accessible (VPN ou autre), on pourra basculer
 * vers le service distant en changeant l'import.
 *
 * Cycle de vie :
 *   1. L'utilisateur upload une photo
 *   2. L'utilisateur choisit un style
 *   3. Le hook appelle cartoonizeLocal(image, styleId)
 *   4. Le résultat (URL blob) est stocké dans "result"
 *   5. Changer de style re-génère l'effet
 *
 * @returns {object}
 *   - result   {string|null}  URL blob de l'image transformée
 *   - loading  {boolean}      true pendant le rendu
 *   - error    {string|null}  Message d'erreur
 *   - cartoonize {function}   Déclenche la transformation (imageUrl, styleId)
 *   - reset    {function}     Réinitialise le résultat
 */
export function useCartoonize() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Permet d'annuler le rendu en cours si l'utilisateur change de style
  const currentJob = useRef(null)

  const cartoonize = useCallback(async (imageUrl, styleId) => {
    if (!imageUrl || !styleId) return

    if (currentJob.current) {
      currentJob.current.aborted = true
    }

    setLoading(true)
    setError(null)

    const job = { aborted: false }
    currentJob.current = job

    try {
      const url = await cartoonizeLocal(imageUrl, styleId)
      if (job.aborted) {
        URL.revokeObjectURL(url)
        return
      }
      setResult(url)
    } catch (err) {
      if (job.aborted) return
      setError(err.message || 'Erreur de transformation')
    } finally {
      if (!job.aborted) {
        setLoading(false)
      }
    }
  }, [])

  const reset = useCallback(() => {
    if (currentJob.current) {
      currentJob.current.aborted = true
    }
    if (result) {
      URL.revokeObjectURL(result)
    }
    setResult(null)
    setError(null)
    setLoading(false)
  }, [result])

  return { result, loading, error, cartoonize, reset }
}
