import express from 'express'
import authRoutes from './auth.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../validation/middleware.js'
import { createUserSchema } from '../validation/schemas/users.js'
import { createUserHandler } from '../controllers/users.js'
import usersRoutes from './users.js'
import userTypesRoutes from './userTypes.js'
import worksRoutes from './works.js'
import suppliersRoutes from './suppliers.js'
import { getUserTypeSchema } from '../validation/schemas/userTypes.js'
import { getUserTypeHandler } from '../controllers/userTypes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.post('/users', validate(createUserSchema), createUserHandler)
router.get('/user-types', validate(getUserTypeSchema), getUserTypeHandler)

router.use(authenticate)
router.use(usersRoutes)
router.use(userTypesRoutes)
router.use(worksRoutes)
router.use(suppliersRoutes)

export default router
