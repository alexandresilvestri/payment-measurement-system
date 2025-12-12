import type { User, UserDatabaseRow } from '../models/users'
import { db } from '../database/db'

class UserRepository {
  async createUser(user: UserDatabaseRow): Promise<void> {
    try {
      await db('users').insert(this.userToTableRow(user))
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes(
          'duplicate key value violates unique constraint "users_email_unique"'
        )
      ) {
        throw new Error('Email already exists')
      }

      throw err
    }
  }

  async updateUser(
    id: string,
    updates: Partial<Omit<UserDatabaseRow, 'id'>>
  ): Promise<void> {
    const result = await db('users').where({ id }).update(updates)

    if (result === 0) {
      throw new Error('User not found')
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db('users').where({ email }).first()

    if (!user) {
      return null
    }

    return this.tableRowToUser(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await db('users').where({ id }).first()

    if (!user) {
      return null
    }

    return this.tableRowToUser(user)
  }

  private userToTableRow(register: UserDatabaseRow): UserDatabaseRow {
    return {
      id: register.id,
      email: register.email,
      password: register.password,
      type_user_id: register.type_user_id,
    }
  }

  private tableRowToUser(row: UserDatabaseRow): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password,
      userType: row.type_user_id,
    }
  }
}

export const userRepository = new UserRepository()
