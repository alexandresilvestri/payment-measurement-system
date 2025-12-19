import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import usersRoutes from './routes/users'
import userTypesRoutes from './routes/userTypes'
import worksRoutes from './routes/works'
import suppliersRoutes from './routes/suppliers'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', usersRoutes)
app.use('/api', userTypesRoutes)
app.use('/api', worksRoutes)
app.use('/api', suppliersRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
