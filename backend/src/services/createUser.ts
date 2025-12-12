import { randomUUID } from 'node:crypto'
import type { UserDatabaseRow, UserResponse } from '../models/users'
import { userRepository } from '../repository/users'
import { hashPassword } from './passwordHash'

export type CreateUserParams = {
  email: string
  password: string
}

export async function createUser(
  params: CreateUserParams
): Promise<UserResponse> {
  const createUserIntent: UserDatabaseRow = {
    id: randomUUID(),
    email: params.email,
    password: await hashPassword(params.password),
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
