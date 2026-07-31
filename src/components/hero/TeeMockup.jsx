export default function TeeMockup({ photo, avatar, showPhoto, color = '#ff6b35' }) {
  return (
    <div style={wrapStyle}>
      <svg viewBox="0 0 320 360" style={{ width: '100%', display: 'block' }}>
        <defs>
          <clipPath id="tee-print-clip">
            <rect x="100" y="118" width="120" height="132" rx="16" />
          </clipPath>
          <linearGradient id="tee-fabric" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7f7f7" />
            <stop offset="1" stopColor="#e2e2e2" />
          </linearGradient>
        </defs>

        {/* silhouette du t-shirt */}
        <path
          d="M95 62 C95 52 100 46 108 46 L152 78 L168 78 L212 46 C220 46 225 52 225 62 L268 96 L282 128 L262 146 L262 300 L238 324 L82 324 L58 300 L58 146 L38 128 L52 96 Z"
          fill="url(#tee-fabric)"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="2"
        />

        {/* ourlets des manches */}
        <path d="M38 128 L52 96 L95 62 L108 46" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />
        <path d="M282 128 L268 96 L225 62 L212 46" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />

        {/* col */}
        <path d="M152 78 L160 92 L168 78 L160 66 Z" fill="#1c1c1c" />
        <path d="M152 78 L160 92 L168 78" fill="none" stroke={color} strokeWidth="2.5" opacity="0.7" />

        {/* impression : photo / toon en fondu */}
        <g clipPath="url(#tee-print-clip)">
          <image
            href={photo}
            x="100" y="118" width="120" height="132"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: showPhoto ? 1 : 0, transition: 'opacity 0.6s ease' }}
          />
          <image
            href={avatar.image}
            x="100" y="118" width="120" height="132"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: showPhoto ? 0 : 1, transition: 'opacity 0.6s ease' }}
          />
        </g>

        {/* cadre d'impression */}
        <rect x="100" y="118" width="120" height="132" rx="16" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />

        {/* pli central */}
        <path d="M160 46 L160 324" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
      </svg>
    </div>
  )
}

const wrapStyle = { width: '100%', maxWidth: '360px', filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.45))' }
