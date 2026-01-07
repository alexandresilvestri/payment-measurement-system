import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { contractService } from '../services/Contract.js'

export const createContractHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const contractParams = req.body
        const contract = await contractService.createContract(contractParams)
        res.status(201).json(contract)
    }
)