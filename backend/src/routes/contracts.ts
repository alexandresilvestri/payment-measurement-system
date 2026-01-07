import express from 'express'
import { validate } from '../validation/middleware.js'
import { 
    createContractSchema,
    getContractSchema,
 } from '../validation/schemas/contracts.js'
import { 
    createContractHandler, 
    getContractsHandler, 
    getContractHandler,
} from '../controllers/contracts.js'

const router = express.Router()

router.post('/contracts', validate(createContractSchema), createContractHandler)
router.get('/contracts', getContractsHandler)
router.get('/contracts/:id', validate(getContractSchema), getContractHandler)

export default router