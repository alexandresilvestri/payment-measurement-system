import express from 'express'
import { createSupplierHandler } from '../controllers/suppliers'
// import { validate } from '../validation/middleware'
// import { createSupplierSchema } from '../validation/schemas/suppliers'

const router = express.Router()

router.post('/suppliers', createSupplierHandler)

export default router
