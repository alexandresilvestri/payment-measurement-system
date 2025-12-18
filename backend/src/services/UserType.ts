import { randomUUID } from 'node:crypto'
import type {
  UserTypeDatabaseRow,
  UpdateUserTypeRequest,
} from '../types/userTypes'
import type { IUserTypeRepository } from '../repository/userTypes'
import { NotFoundError } from '../errors'

export type CreateUserTypeParams = {
  name: string
}

export type UpdateUserTypeParams = {
  name: string
}

export class UserTypeService {
  constructor(private userTypeRepo: IUserTypeRepository) {}

  async createUserType(
    params: CreateUserTypeParams
  ): Promise<UserTypeDatabaseRow> {
    const createUserTypeIntent: UserTypeDatabaseRow = {
      id: randomUUID(),
      name: params.name,
    }

    await this.userTypeRepo.create(createUserTypeIntent)
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

  async updateUserType(
    id: string,
    update: UpdateUserTypeRequest
  ): Promise<UserTypeDatabaseRow | null> {
    await this.userTypeRepo.update(id, update)

    return await this.userTypeRepo.findById(id)
  }

  async deleteUserType(id: string): Promise<void> {
    await this.userTypeRepo.delete(id)
  }
}
