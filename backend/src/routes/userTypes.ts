import express from 'express'
import {
  createUserTypeHandler,
  getUserTypeHandler,
  getAllUserTypesHandler,
  updateUserTypeHandler,
  deleteUserTypeHandler,
} from '../controllers/userTypes'
import { validate } from '../validation/middleware'
import {
  createUserTypeSchema,
  getUserTypeSchema,
  updateUserTypeSchema,
} from '../validation/schemas/userTypes'
import { deleteUserSchema } from '../validation/schemas/users'

const router = express.Router()

router.post(
  '/user-types',
  validate(createUserTypeSchema),
  createUserTypeHandler
)
router.get('/user-types', getAllUserTypesHandler)
router.get('/user-types/:id', validate(getUserTypeSchema), getUserTypeHandler)
router.put(
  '/user-types/:id',
  validate(updateUserTypeSchema),
  updateUserTypeHandler
)
router.delete(
  '/user-types/:id',
  validate(deleteUserSchema),
  deleteUserTypeHandler
)

export default router
