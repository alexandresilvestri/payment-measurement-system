import { Request, Response, NextFunction } from 'express'
import { userTypeService } from '../services/instances'
import { NotFoundError } from '../errors'

export async function createUserTypeRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userTypeParams = req.body
    const userType = await userTypeService.createUserType(userTypeParams)
    res.status(201).json(userType)
  } catch (err) {
    next(err)
  }
}

export async function getUserType(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id
    const userType = await userTypeService.getUserTypeById(id)

    if (!userType) {
      throw new NotFoundError('User type not found')
    }

    res.status(200).json(userType)
  } catch (err) {
    next(err)
  }
}

export async function getAllUserTypes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userTypes = await userTypeService.getAllUserTypes()
    res.status(200).json(userTypes)
  } catch (err) {
    next(err)
  }
}
