import express from 'express'
import { createdUserRequest, getUser } from '../controllers/users'

const router = express.Router()

router.post('/users', createdUserRequest)
router.get('/user/:id', getUser)

export default router
