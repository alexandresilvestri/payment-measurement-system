import express from 'express'
import {
  createWorkHandler,
  getWorkHandler,
  updateWorkHandler,
  deleteWorkHandler,
} from '../controllers/works'
import { validate } from '../validation/middleware'
import {
  createWorkSchema,
  getWorkSchema,
  updateWorkSchema,
  deleteWorkSchema,
} from '../validation/schemas/works'

const router = express.Router()

router.post('/works', validate(createWorkSchema), createWorkHandler)
router.get('/works/:id', validate(getWorkSchema), getWorkHandler)
router.put('/works/:id', validate(updateWorkSchema), updateWorkHandler)
router.delete('/works/:id', validate(deleteWorkSchema), deleteWorkHandler)

export default router
