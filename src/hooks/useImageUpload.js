import { useState, useCallback } from 'react'

export function useImageUpload() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = useCallback((file) => {
    setError(null)

    if (!file || !file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop volumineuse (max 5 Mo)')
      return
    }

    setLoading(true)
    setImage(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setLoading(false)
    }
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier')
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }, [])

  const reset = useCallback(() => {
    setImage(null)
    setPreview(null)
    setError(null)
    setLoading(false)
  }, [])

  return { image, preview, loading, error, handleFile, reset }
}
