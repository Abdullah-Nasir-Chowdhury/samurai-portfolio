import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serves the Vercel functions in /api during `npm run dev`, so the omikuji works locally too.
const vercelApiInDev = () => ({
  name: 'vercel-api-in-dev',
  configureServer(server) {
    server.middlewares.use('/api/omikuji', async (req, res) => {
      const { default: handler } = await server.ssrLoadModule('/api/omikuji.js')
      await handler(req, res)
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiInDev()],
})
