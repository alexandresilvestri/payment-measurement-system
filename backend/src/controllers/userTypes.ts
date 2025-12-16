import { Request, Response } from 'express'
import { userTypeService } from '../services/instances'
import { NotFoundError } from '../errors'
import { asyncHandler } from '../utils/asyncHandler'

export const createUserTypeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userTypeParams = req.body
    const userType = await userTypeService.createUserType(userTypeParams)
    res.status(201).json(userType)
  }
)

export const getUserTypeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const userType = await userTypeService.getUserTypeById(id)

    if (!userType) {
      throw new NotFoundError('User type not found')
    }

    res.status(200).json(userType)
  }
)

export const getAllUserTypesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userTypes = await userTypeService.getAllUserTypes()
    res.status(200).json(userTypes)
  }
)
