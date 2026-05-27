import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { authRouter } from './routes/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Minimal .env loader (avoids adding `dotenv` as a runtime dependency).
function loadDotEnv(filePath: string) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (process.env[key] === undefined) process.env[key] = value
  }
}
loadDotEnv(path.join(rootDir, '.env'))

const app = express()
app.use(express.json({ limit: '1mb' }))

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Mount auth routes under both the versioned API path (login) and the
// legacy OAuth path (/auth/github/*) that the spec asks us to preserve.
app.use('/api/v1/auth', authRouter)
app.use('/auth', authRouter)

// Serve built frontend assets when present (production mode).
const distDir = path.join(rootDir, 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^\/(?!api\/|auth\/).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const port = Number(process.env.PORT ?? 5013)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}`)
})
