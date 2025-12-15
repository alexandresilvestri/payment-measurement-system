import express from 'express'
import { createUserRequest, getUser } from '../../controllers/users/users'

const router = express.Router()

router.post('/users', createUserRequest)
router.get('/users/:id', getUser)

export default router
