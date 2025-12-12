import express from 'express'
import { createdUserRequest } from '../controllers/users'

const router = express.Router()

router.post('/users', createdUserRequest)

export default router
