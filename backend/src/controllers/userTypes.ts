import { Request, Response } from 'express'
import { createUserType } from '../services/createUserType'
import { userTypeRepository } from '../repository/userTypes'

export async function createUserTypeRequest(
  req: Request,
  res: Response
): Promise<void> {
  const userTypeParams = req.body
  try {
    const userType = await createUserType(userTypeParams)
    res.status(201).json(userType)
  } catch (err) {
    res.status(500)
    console.error(err)
  }
}

export async function getUserType(req: Request, res: Response): Promise<void> {
  const id = req.params.id
  try {
    const userType = await userTypeRepository.findById(id)

    if (!userType) throw new Error('User not found')

    res.status(200).json(userType)
  } catch (err) {
    res.status(500)
    console.error(err)
  }
}

export async function getAllUserTypes(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userTypes = await userTypeRepository.findAll()
    res.status(200).json(userTypes)
  } catch (err) {
    res.status(500)
    console.error(err)
  }
}
