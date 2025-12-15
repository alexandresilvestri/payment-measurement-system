import dotenv from 'dotenv'
import app from './app'
import { config } from './database/config'

dotenv.config()

const PORT = config.server.port

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${config.environment}`)
  console.log(`Database: ${config.database.database}`)
  console.log(`Database host: ${config.database.host}:${config.database.port}`)
})
