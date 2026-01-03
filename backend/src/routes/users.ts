import express from 'express'
import {
  createUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/users.js'
import { validate } from '../validation/middleware.js'
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from '../validation/schemas/users.js'

const router = express.Router()

router.post('/users', validate(createUserSchema), createUserHandler)
router.get('/users/:id', validate(getUserSchema), getUserHandler)
router.put('/users/:id', validate(updateUserSchema), updateUserHandler)
router.delete('/users/:id', validate(deleteUserSchema), deleteUserHandler)

export default router
