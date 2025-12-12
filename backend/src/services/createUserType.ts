import { randomUUID } from 'node:crypto'
import type { UserTypeDatabaseRow } from '../models/users'
import { userTypeRepository } from '../repository/userTypes'

export type CreateUserTypeParams = {
  id: string
  name: string
}

export async function createUserType(
  params: CreateUserTypeParams
): Promise<UserTypeDatabaseRow> {
  const createUserTypeIntent: UserTypeDatabaseRow = {
    id: randomUUID(),
    name: params.name,
  }

  await userTypeRepository.createUserType(createUserTypeIntent)
  const createdUserType = await userTypeRepository.findById(
    createUserTypeIntent.id
  )

  if (!createdUserType) throw new Error('Failed to create user')

  const userResponse: UserTypeDatabaseRow = {
    id: createUserTypeIntent.id,
    name: createUserTypeIntent.name,
  }

  return userResponse
}
