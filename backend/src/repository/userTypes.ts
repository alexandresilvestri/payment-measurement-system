import { UserType } from '../types/userTypes'
import { UserTypeDatabaseRow } from '../types/database'
import { BaseRepository } from './BaseRepository'
import { ConflictError } from '../errors'

export interface IUserTypeRepository {
  create(userType: UserType): Promise<void>
  findById(id: string): Promise<UserType | null>
  findAll(): Promise<UserType[]>
  update(
    id: string,
    updates: Partial<Omit<UserTypeDatabaseRow, 'id'>>
  ): Promise<void>
  delete(id: string): Promise<void>
}

class UserTypeRepository
  extends BaseRepository<UserType, UserTypeDatabaseRow>
  implements IUserTypeRepository
{
  constructor() {
    super('user_types')
  }

  async create(userType: UserType): Promise<void> {
    if (await this.findBy({ name: userType.name })) {
      throw new ConflictError('User type already exists')
    }

    await super.create(userType)
  }

  protected toDomain(row: UserTypeDatabaseRow): UserType {
    return {
      id: row.id,
      name: row.name,
      approveMeasurement: row.approve_measurement,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  protected toDatabase(data: UserType): UserTypeDatabaseRow {
    return {
      id: data.id,
      name: data.name,
      approve_measurement: data.approveMeasurement,
    }
  }
}

export const userTypeRepository = new UserTypeRepository()
