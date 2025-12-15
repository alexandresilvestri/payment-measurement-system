import type { User } from '../models/users/users'
import type { UserDatabaseRow } from '../models/users/userDatabase/users'
import { db } from '../database/db'
import { ConflictError, NotFoundError } from '../errors'
export interface IUserRepository {
  createUser(user: User): Promise<void>
  updateUser(id: string, updates: Partial<Omit<UserDatabaseRow, 'id'>>): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}

class UserRepository implements IUserRepository {
  async createUser(user: User): Promise<void> {
    try {
      await db('users').insert(this.userToTableRow(user))
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes(
          'duplicate key value violates unique constraint "users_email_unique"'
        )
      ) {
        throw new ConflictError('Email already exists')
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
      throw new NotFoundError('User not found')
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

  private userToTableRow(register: User): UserDatabaseRow {
    return {
      id: register.id,
      first_name: register.firstName,
      last_name: register.lastName,
      email: register.email,
      password: register.passwordHash,
      type_user_id: register.userType,
    }
  }

  private tableRowToUser(row: UserDatabaseRow): User {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      passwordHash: row.password,
      userType: row.type_user_id,
    }
  }
}

export const userRepository = new UserRepository()
