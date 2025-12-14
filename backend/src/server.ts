import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🗄️ Database: ${process.env.DB_NAME}`)
})
