import express from 'express'
import {
  createWorkHandler,
  getWorkHandler,
  getAllWorksHandler,
  updateWorkHandler,
  deleteWorkHandler,
} from '../controllers/works.js'
import { validate } from '../validation/middleware.js'
import {
  createWorkSchema,
  getWorkSchema,
  updateWorkSchema,
  deleteWorkSchema,
} from '../validation/schemas/works.js'

const router = express.Router()

router.post('/works', validate(createWorkSchema), createWorkHandler)
router.get('/works/:id', validate(getWorkSchema), getWorkHandler)
router.get('/works', getAllWorksHandler)
router.put('/works/:id', validate(updateWorkSchema), updateWorkHandler)
router.delete('/works/:id', validate(deleteWorkSchema), deleteWorkHandler)

export default router
