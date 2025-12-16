import express from 'express'
import { createUserHandler, getUserHandler } from '../controllers/users'
import { validate } from '../validation/middleware'
import { createUserSchema, getUserSchema } from '../validation/schemas/users'

const router = express.Router()

router.post('/users', validate(createUserSchema), createUserHandler)
router.get('/users/:id', validate(getUserSchema), getUserHandler)

export default router
