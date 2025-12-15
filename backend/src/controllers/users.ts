import { Request, Response, NextFunction } from 'express'
import { userService } from '../services/instances'
import { NotFoundError } from '../errors'

export async function createUserRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userParams = req.body
    const user = await userService.createUser(userParams)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id
    const user = await userService.getUserById(id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}
