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

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', routes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
