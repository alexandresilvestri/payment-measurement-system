import express from 'express'
import {
  createUserHandler,
  getUserHandler,
  updateUserHandler,
} from '../controllers/users'
import { validate } from '../validation/middleware'
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from '../validation/schemas/users'

const router = express.Router()

router.post('/users', validate(createUserSchema), createUserHandler)
router.get('/users/:id', validate(getUserSchema), getUserHandler)
router.put('/users/:id', validate(updateUserSchema), updateUserHandler)
// router.delete('/users/:id', validate(deleteUserSchema), deleteUserHandler)

export default router
