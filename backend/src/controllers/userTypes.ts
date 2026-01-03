import { Request, Response } from 'express'
import { userTypeService } from '../services/instances.js'
import { NotFoundError } from '../errors/index.js'
import { asyncHandler } from '../utils/asyncHandler.js'

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

export const updateUserTypeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const update = req.body
    const updatedUserType = await userTypeService.updateUserType(id, update)

    if (!updatedUserType) throw new NotFoundError('User type not found')

    res.status(200).json(updatedUserType)
  }
)

export const deleteUserTypeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id

    await userTypeService.deleteUserType(id)

    res.status(204).send()
  }
)
