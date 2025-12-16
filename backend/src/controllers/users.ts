import { Request, Response } from 'express'
import { userService } from '../services/instances'
import { NotFoundError } from '../errors'
import { asyncHandler } from '../utils/asyncHandler'

export const createUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userParams = req.body
    const user = await userService.createUser(userParams)
    res.status(201).json(user)
  }
)

export const getUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const user = await userService.getUserById(id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    res.status(200).json(user)
  }
)
