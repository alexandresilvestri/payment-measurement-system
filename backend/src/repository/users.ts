import type { User } from '../types/users'
import type { UserDatabaseRow } from '../types/database'
import { BaseRepository } from './BaseRepository'
import { ConflictError } from '../errors'

export interface IUserRepository {
  create(user: User): Promise<void>
  update(
    id: string,
    updates: Partial<Omit<UserDatabaseRow, 'id'>>
  ): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}

class UserRepository
  extends BaseRepository<User, UserDatabaseRow>
  implements IUserRepository
{
  constructor() {
    super('users')
  }

  async create(user: User): Promise<void> {
    try {
      await super.create(user)
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

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db('users').where({ email }).first<UserDatabaseRow>()

    if (!row) return null

    return this.toDomain(row)
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db('users').where({ id }).first<UserDatabaseRow>()

    if (!row) return null

    return this.toDomain(row)
  }

  protected toDomain(row: UserDatabaseRow): User {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      passwordHash: row.password,
      userType: row.type_user_id,
    }
  }

  protected toDatabase(user: User): UserDatabaseRow {
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: user.passwordHash,
      type_user_id: user.userType,
    }
  }
}

export const userRepository = new UserRepository()
