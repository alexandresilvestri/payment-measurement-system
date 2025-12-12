import { Request, Response } from 'express'
import { createUser } from '../services/createUser'
import { userRepository } from '../repository/users'
import { serializeUser } from '../serializers/users'

export async function createdUserRequest(
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

    const userReponse = await serializeUser(user)

    res.status(200).json(userReponse)
  } catch (err) {
    res.status(500)
    console.error(err)
  }
}
