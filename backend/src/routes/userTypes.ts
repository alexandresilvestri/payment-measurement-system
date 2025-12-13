import express from 'express'
import {
  createUserTypeRequest,
  getUserType,
  getAllUserTypes,
} from '../controllers/userTypes'

const router = express.Router()

router.post('/user-types', createUserTypeRequest)
router.get('/user-types', getAllUserTypes)
router.get('/user-types/:id', getUserType)

export default router
