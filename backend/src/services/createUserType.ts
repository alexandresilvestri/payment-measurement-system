import { randomUUID } from 'node:crypto'
import type { UserTypeDatabaseRow } from '../models/users/userDatabase/userTypes'
import type { IUserTypeRepository } from '../repository/userTypes'
import { NotFoundError } from '../errors'

export type CreateUserTypeParams = {
  name: string
}

/**
 * UserType Service with Dependency Injection
 * Handles all business logic for user type operations
 */
export class UserTypeService {
  constructor(private userTypeRepo: IUserTypeRepository) {}

  async createUserType(
    params: CreateUserTypeParams
  ): Promise<UserTypeDatabaseRow> {
    const createUserTypeIntent: UserTypeDatabaseRow = {
      id: randomUUID(),
      name: params.name,
    }

    await this.userTypeRepo.createUserType(createUserTypeIntent)
    const createdUserType = await this.userTypeRepo.findById(
      createUserTypeIntent.id
    )

    if (!createdUserType) throw new NotFoundError('Failed to create user type')

    const userResponse: UserTypeDatabaseRow = {
      id: createUserTypeIntent.id,
      name: createUserTypeIntent.name,
    }

    return userResponse
  }

  async getUserTypeById(id: string): Promise<UserTypeDatabaseRow | null> {
    return await this.userTypeRepo.findById(id)
  }

  async getAllUserTypes(): Promise<UserTypeDatabaseRow[]> {
    return await this.userTypeRepo.findAll()
  }
}
