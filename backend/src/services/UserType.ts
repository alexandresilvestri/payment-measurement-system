import { randomUUID } from 'node:crypto'
import type { UserType } from '../types/userTypes.js'
import type { UpdateUserTypeRequest } from '../types/api/userTypes.js'
import type { IUserTypeRepository } from '../repository/userTypes.js'
import { NotFoundError } from '../errors/index.js'

export type CreateUserTypeParams = {
  name: string
  approveMeasurement: boolean
}

export type UpdateUserTypeParams = {
  name?: string
  approveMeasurement?: boolean
}

export class UserTypeService {
  constructor(private userTypeRepo: IUserTypeRepository) {}

  async createUserType(params: CreateUserTypeParams): Promise<UserType> {
    const createUserTypeIntent: UserType = {
      id: randomUUID(),
      name: params.name,
      approveMeasurement: params.approveMeasurement,
    }

    await this.userTypeRepo.create(createUserTypeIntent)
    const createdUserType = await this.userTypeRepo.findById(
      createUserTypeIntent.id
    )

    if (!createdUserType) throw new NotFoundError('Failed to create user type')

    return createdUserType
  }

  async getUserTypeById(id: string): Promise<UserType | null> {
    return await this.userTypeRepo.findById(id)
  }

  async getAllUserTypes(): Promise<UserType[]> {
    return await this.userTypeRepo.findAll()
  }

  async updateUserType(
    id: string,
    update: UpdateUserTypeRequest
  ): Promise<UserType | null> {
    await this.userTypeRepo.update(id, update)

    return await this.userTypeRepo.findById(id)
  }

  async deleteUserType(id: string): Promise<void> {
    await this.userTypeRepo.delete(id)
  }
}
