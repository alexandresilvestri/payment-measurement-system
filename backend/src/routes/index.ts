import express from 'express'
import authRoutes from './auth'
import usersRoutes from './users'
import userTypesRoutes from './userTypes'
import worksRoutes from './works'
import suppliersRoutes from './suppliers'
import { authenticate } from '../middleware/auth'

const router = express.Router()

router.use('/auth', authRoutes)
router.post('/users', usersRoutes)

router.use(authenticate)

router.use(usersRoutes)
router.use(userTypesRoutes)
router.use(worksRoutes)
router.use(suppliersRoutes)

export default router
