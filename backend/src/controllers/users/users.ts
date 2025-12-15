import { Request, Response } from 'express'
import { createUser } from '../../services/users/createUser'
import { userRepository } from '../../repository/users/users'

export async function createUserRequest(
  req: Request,
  res: Response
): Promise<void> {
  const userParams = req.body
  try {
    const user = await createUser(userParams)
    res.status(201).json(user)
  } catch (err) {
    res.status(500)
    console.error(err)
  }
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const id = req.params.id
  try {
    const user = await userRepository.findById(id)

    if (!user) throw new Error('User not found')

    res.status(200).json(user)
  } catch (err) {
    res.status(500)
    console.error(err)
  }
}
