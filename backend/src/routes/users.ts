import express from 'express'
import { createUserRequest, getUser } from '../controllers/users'

const router = express.Router()

router.post('/users', createUserRequest)
router.get('/user/:id', getUser)

export default router
