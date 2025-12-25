import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from project root (works both locally and in Docker)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Database: ${process.env.DB_NAME}`)
  console.log(
    `Authentication: ${process.env.AUTH_ENABLED !== 'false' ? 'enabled' : 'DISABLED (dev mode)'}`
  )
})
