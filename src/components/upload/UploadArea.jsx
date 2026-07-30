import { useRef, useState } from 'react'

export default function UploadArea({ onFileSelect, preview, loading, error }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onFileSelect(file)
  }

  return (
    <section id="upload" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <h2 className="section-title" style={titleStyle}>
          1. Envoie ta <span className="gradient-text">photo</span>
        </h2>
        <p style={subStyle}>
          Selfie, portrait ou photo de groupe. Notre IA va te transformer en héros.
        </p>

        <div
          className="upload-dropzone"
          style={{
            ...dropzoneStyle,
            borderColor: dragOver ? 'var(--orange)' : error ? '#ef4444' : 'rgba(255,255,255,0.1)',
            background: dragOver ? 'rgba(255,107,53,0.05)' : error ? 'rgba(239,68,68,0.05)' : 'var(--black-2)',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          {loading ? (
            <div style={loadingStyle}>
              <div style={spinnerStyle} />
              <p style={{ color: 'var(--gray-500)' }}>Analyse en cours...</p>
            </div>
          ) : preview ? (
            <img src={preview} alt="Preview" style={previewImgStyle} />
          ) : (
            <div style={placeholderStyle}>
              <div style={iconBoxStyle}>📸</div>
              <p style={{ fontWeight: 600, color: 'var(--gray-400)' }}>
                Clique ou glisse ta photo ici
              </p>
              <p style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
                PNG, JPG • Max 5 Mo
              </p>
            </div>
          )}
        </div>

        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </section>
  )
}

const sectionStyle = {
  padding: '100px 0',
  background: 'var(--black-2)',
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
}

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '36px',
  fontWeight: 700,
  textAlign: 'center',
  letterSpacing: '-1px',
  color: 'var(--white)',
}

const subStyle = {
  fontSize: '16px',
  color: 'var(--gray-500)',
  textAlign: 'center',
  maxWidth: '500px',
  marginBottom: '16px',
}

const dropzoneStyle = {
  width: '100%',
  maxWidth: '520px',
  height: '360px',
  border: '2px dashed',
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s',
  overflow: 'hidden',
}

const placeholderStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
}

const iconBoxStyle = {
  fontSize: '56px',
  marginBottom: '8px',
}

const previewImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
}

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
}

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '3px solid rgba(255,255,255,0.1)',
  borderTopColor: 'var(--orange)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

const errorStyle = {
  color: '#ef4444',
  fontSize: '14px',
  fontWeight: 500,
}
