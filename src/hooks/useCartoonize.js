import { useState, useRef, useCallback } from 'react'
import { cartoonizeLocal } from '../services/cartoonizer'

export function useCartoonize() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      if (job.aborted) return
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
    if (result) URL.revokeObjectURL(result)
    setResult(null)
    setError(null)
    setLoading(false)
  }, [result])

  return { result, loading, error, cartoonize, reset }
}
