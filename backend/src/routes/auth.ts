import express from 'express'
import {
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
} from '../controllers/auth.js'
import { validate } from '../validation/middleware.js'
import {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../validation/schemas/auth.js'

const router = express.Router()

router.post('/login', validate(loginSchema), loginHandler)
router.post('/refresh', validate(refreshTokenSchema), refreshTokenHandler)
router.post('/logout', validate(logoutSchema), logoutHandler)

export default router
