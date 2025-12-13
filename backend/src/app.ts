import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { errorHandler } from './middleware/errorHandler'
import { healthTest } from './routes/system'

import usersRoutes from './routes/users'
import userTypesRoutes from './routes/userTypes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', usersRoutes)
app.use('/api', userTypesRoutes)

app.use('/health', healthTest)
app.use(errorHandler)

export default app
