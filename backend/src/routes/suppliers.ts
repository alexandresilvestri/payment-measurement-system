import express from 'express'
import {
  createSupplierHandler,
  getSupplierHandler,
  getSuppliersHandler,
  updateSupplierHandler,
  deleteSupplierHandler,
} from '../controllers/suppliers.js'
import { validate } from '../validation/middleware.js'
import {
  createSupplierSchema,
  getSupplierSchema,
  updateSupplierSchema,
  deleteSupplierSchema,
} from '../validation/schemas/suppliers.js'

const router = express.Router()

router.post('/suppliers', validate(createSupplierSchema), createSupplierHandler)
router.get('/suppliers/:id', validate(getSupplierSchema), getSupplierHandler)
router.get('/suppliers', getSuppliersHandler)
router.put(
  '/suppliers/:id',
  validate(updateSupplierSchema),
  updateSupplierHandler
)
router.delete(
  '/suppliers/:id',
  validate(deleteSupplierSchema),
  deleteSupplierHandler
)

export default router
