import { UserTypeDatabaseRow } from '../models/users/userDatabase/userTypes'
import { db } from '../database/db'
import { ConflictError } from '../errors'

export interface IUserTypeRepository {
  createUserType(userType: UserTypeDatabaseRow): Promise<void>
  findById(id: string): Promise<UserTypeDatabaseRow | null>
  findAll(): Promise<UserTypeDatabaseRow[]>
}

class UserTypeRepository implements IUserTypeRepository {
  async createUserType(userType: UserTypeDatabaseRow): Promise<void> {
    try {
      await db('user_types').insert(this.userTypeToTableRow(userType))
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

  async findById(id: string): Promise<UserTypeDatabaseRow | null> {
    const typeUser = await db('user_types').where({ id }).first()

    if (!typeUser) return null

    return typeUser
  }

  async findAll(): Promise<UserTypeDatabaseRow[]> {
    const userTypes = await db('user_types').select('*')
    return userTypes
  }

  private userTypeToTableRow(
    register: UserTypeDatabaseRow
  ): UserTypeDatabaseRow {
    return {
      id: register.id,
      name: register.name,
    }
  }
}

export const userTypeRepository = new UserTypeRepository()
