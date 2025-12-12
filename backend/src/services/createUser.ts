import { randomUUID } from 'node:crypto'
import type { UserDatabaseRow, UserResponse } from '../models/users'
import { userRepository } from '../repository/users'
import { hashPassword } from './passwordHash'

export type CreateUserParams = {
  email: string
  password: string
  type_user_id: string
}

export async function createUser(
  params: CreateUserParams
): Promise<UserResponse> {
  const createUserIntent: UserDatabaseRow = {
    id: randomUUID(),
    email: params.email,
    password: await hashPassword(params.password),
    type_user_id: params.type_user_id,
  }

  await userRepository.createUser(createUserIntent)
  const createdUser = await userRepository.findById(createUserIntent.id)

  if (!createdUser) throw new Error('Failed to create user')

  const userResponse: UserResponse = {
    id: createUserIntent.id,
    email: createUserIntent.email,
  }

  return userResponse
}
