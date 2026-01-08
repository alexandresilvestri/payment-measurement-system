import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { contractService } from '../services/instances.js'

export const createContractHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const contractParams = req.body
    const contract =
      await contractService.createContractWithItems(contractParams)
    res.status(201).json(contract)
  }
)

export const getContractsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const contracts = await contractService.getContracts()
    res.status(201).json(contracts)
  }
)

export const getContractHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const contract = await contractService.getContract(id)
    res.status(201).json(contract)
  }
)
