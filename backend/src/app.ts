import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes/index.js'
import {
  errorHandler,
  notFoundHandler,
} from './errors/middleware/errorHandler.js'

const app = express()

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const frontendUrl = process.env.FRONTEND_URL
    const allowedOrigins = []

    if (frontendUrl) {
      allowedOrigins.push(frontendUrl)
    }

    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:5173')
      allowedOrigins.push('http://localhost:3000')
      allowedOrigins.push('http://127.0.0.1:5173')
      allowedOrigins.push('http://127.0.0.1:3000')
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', routes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
