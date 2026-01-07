import express from 'express'
import { validate } from '../validation/middleware.js'
import { createContractSchema } from '../validation/schemas/contracts.js'
import { createContractHandler } from '../controllers/contracts.js'

const router = express.Router()

router.post('/contracts', validate(createContractSchema), createContractHandler)

export default router