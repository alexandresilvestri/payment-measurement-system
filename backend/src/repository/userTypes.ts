import { UserTypeDatabaseRow } from '../types/userTypes'
import { BaseRepository } from './BaseRepository'
import { ConflictError } from '../errors'

export interface IUserTypeRepository {
  create(userType: UserTypeDatabaseRow): Promise<void>
  findById(id: string): Promise<UserTypeDatabaseRow | null>
  findAll(): Promise<UserTypeDatabaseRow[]>
  update(
    id: string,
    updates: Partial<Omit<UserTypeDatabaseRow, 'id'>>
  ): Promise<void>
  delete(id: string): Promise<void>
}

class UserTypeRepository
  extends BaseRepository<UserTypeDatabaseRow>
  implements IUserTypeRepository
{
  constructor() {
    super('user_types')
  }

  async create(userType: UserTypeDatabaseRow): Promise<void> {
    try {
      await super.create(userType)
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes(
          'duplicate key value violates unique constraint "user_types_name_unique"'
        )
      ) {
        throw new ConflictError('User type already exists')
      }

      throw err
    }
  }
}

export const userTypeRepository = new UserTypeRepository()
