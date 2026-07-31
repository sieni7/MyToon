export function compressImage(file, maxSize = 600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Image illisible'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Lecture impossible'))
    reader.readAsDataURL(file)
  })
}

export function compressImageToBlob(file, maxSize = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Compression impossible'))
        }, 'image/jpeg', quality)
      }
      img.onerror = () => reject(new Error('Image illisible'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Lecture impossible'))
    reader.readAsDataURL(file)
  })
}
