import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { supplierService } from '../services/instances.js'

export const createSupplierHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const supplierParams = req.body
    const supplier = await supplierService.createSupplier(supplierParams)
    res.status(201).json(supplier)
  }
)

export const getSupplierHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const supplier = await supplierService.getSupplierById(id)
    res.status(200).json(supplier)
  }
)

export const getSuppliersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const suppliers = await supplierService.getAllSuppliers()
    res.status(200).json(suppliers)
  }
)

export const updateSupplierHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updates = req.body
    const updatedSupplier = await supplierService.updateSupplier(id, updates)
    res.status(200).json(updatedSupplier)
  }
)

export const deleteSupplierHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    await supplierService.deleteSupplier(id)
    res.status(204).send()
  }
)
