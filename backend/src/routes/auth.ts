import express from 'express'
import {
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
} from '../controllers/auth'
import { validate } from '../validation/middleware'
import {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../validation/schemas/auth'

const router = express.Router()

router.post('/login', validate(loginSchema), loginHandler)
router.post('/refresh', validate(refreshTokenSchema), refreshTokenHandler)
router.post('/logout', validate(logoutSchema), logoutHandler)

export default router
