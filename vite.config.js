import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'dns'

/**
 * Utilise Google DNS pour résoudre les noms de domaine côté serveur.
 * Contourne les FAI (Orange/MTN CI) qui bloquent Hugging Face.
 */
dns.setServers(['8.8.8.8', '8.8.4.4'])

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      /**
       * Proxy Vite : le navigateur appelle /hf-api/...
       * Vite relaie vers api-inference.huggingface.co
       * Cela contourne à la fois le DNS pourri ET le CORS.
       */
      '/hf-api': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hf-api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('[Vite Proxy HF] Erreur :', err.message)
          })
        },
      },
    },
  },
})
