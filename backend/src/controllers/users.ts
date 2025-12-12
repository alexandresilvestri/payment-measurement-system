import { Request, Response } from 'express'
import { createUser } from '../services/createUser'

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
