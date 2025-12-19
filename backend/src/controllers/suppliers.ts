import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { supplierService } from '../services/instances'

export const createSupplierHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const supplierParams = req.body
    const supplier = await supplierService.createSupplier(supplierParams)
    res.status(201).json(supplier)
  }
)
