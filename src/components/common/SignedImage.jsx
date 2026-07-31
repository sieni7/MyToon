import { useEffect, useState } from 'react'
import { supabase, MEDIA_BUCKET } from '../../lib/supabase'

export default function SignedImage({ path, ...rest }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    let active = true
    setUrl(null)
    if (!path || !supabase) return
    supabase.storage
      .from(MEDIA_BUCKET)
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (active && data?.signedUrl) setUrl(data.signedUrl)
      })
      .catch(() => {})
    return () => { active = false }
  }, [path])

  if (!url) return <div style={{ ...rest, background: 'var(--black-3)' }} />
  return <img src={url} alt={rest.alt || ''} {...rest} />
}
