import { Request, Response } from 'express'
import { userService } from '../services/instances.js'
import { NotFoundError } from '../errors/index.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { UpdateUserRequest } from '../types/api/users.js'

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

export const updateUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updates = req.body as UpdateUserRequest
    const user = await userService.updateUser(id, updates)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    res.status(200).json(user)
  }
)

export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id
    await userService.deleteUser(id)
    const user = await userService.getUserById(id)

    if (user) throw new Error('Failed to delete work')

    res.status(204).send()
  }
)
