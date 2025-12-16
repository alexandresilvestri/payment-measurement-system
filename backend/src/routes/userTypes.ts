import express from 'express'
import {
  createUserTypeHandler,
  getUserTypeHandler,
  getAllUserTypesHandler,
} from '../controllers/userTypes'
import { validate } from '../validation/middleware'
import {
  createUserTypeSchema,
  getUserTypeSchema,
} from '../validation/schemas/userTypes'

const router = express.Router()

router.post(
  '/user-types',
  validate(createUserTypeSchema),
  createUserTypeHandler
)
router.get('/user-types', getAllUserTypesHandler)
router.get('/user-types/:id', validate(getUserTypeSchema), getUserTypeHandler)

export default router
