import express from 'express'
import {
  createUserTypeRequest,
  getUserType,
} from '../../controllers/users/userTypes'

const router = express.Router()

router.post('/user-types', createUserTypeRequest)
router.get('/user-types/:id', getUserType)

export default router
