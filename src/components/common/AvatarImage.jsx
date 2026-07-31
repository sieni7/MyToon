import { useState } from 'react'
import { getStyle } from '../../utils/constants'

export default function AvatarImage({ avatar, size = '100%', style: extraStyle, emojiSize = 48 }) {
  const [error, setError] = useState(false)
  const style = getStyle(avatar.style)

  if (error || !avatar.image) {
    return (
      <div
        style={{
          width: size,
          aspectRatio: '1',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${style.color}33, transparent)`,
          border: `1px solid ${style.color}44`,
          ...extraStyle,
        }}
      >
        <span style={{ fontSize: emojiSize }}>{style.emoji}</span>
      </div>
    )
  }

  return (
    <img
      src={avatar.image}
      alt={avatar.name}
      onError={() => setError(true)}
      style={{ width: size, aspectRatio: '1', objectFit: 'cover', borderRadius: 16, ...extraStyle }}
    />
  )
}
