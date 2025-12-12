import { UserTypeDatabaseRow } from '../models/users'
import { db } from '../database/db'

class UserTypeRepository {
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
        throw new Error('User type already exists')
      }

      throw err
    }
  }

  async findById(id: string): Promise<UserTypeDatabaseRow | null> {
    const typeUser = await db('user_types').where({ id }).first()

    if (!typeUser) return null

    return typeUser
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
