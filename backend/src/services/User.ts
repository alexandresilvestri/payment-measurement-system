import { randomUUID } from 'node:crypto'
import { UserResponse, UpdateUserRequest } from '../types/api/users.js'
import type { User } from '../types/users.js'
import type { IUserRepository } from '../repository/users.js'
import type { IUserTypeRepository } from '../repository/userTypes.js'
import { hashPassword } from '../utils/passwordHash.js'
import { mapUpdateUserRequestToDb } from '../utils/mappers/userMapper.js'
import { NotFoundError } from '../errors/index.js'

export type CreateUserParams = {
  firstName: string
  lastName: string
  email: string
  password: string
  userType: string
}

export type UpdateUserParams = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  userType?: string
}

export class UserService {
  constructor(
    private userRepo: IUserRepository,
    private userTypeRepo: IUserTypeRepository
  ) {}

  async createUser(params: CreateUserParams): Promise<UserResponse> {
    const createUserIntent: User = {
      id: randomUUID(),
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      email: params.email.trim().toLowerCase(),
      passwordHash: await hashPassword(params.password),
      userType: params.userType,
    }

    await this.userRepo.create(createUserIntent)
    const createdUser = await this.userRepo.findById(createUserIntent.id)

    if (!createdUser) throw new NotFoundError('Failed to create user')

    const userTypeId = createUserIntent.userType
    const fullName: string = `${createUserIntent.firstName} ${createUserIntent.lastName}`

    const userResponse: UserResponse = {
      id: createUserIntent.id,
      fullName: fullName,
      email: createUserIntent.email,
      userType: await this.userTypeRepo.findById(userTypeId),
    }

    return userResponse
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const userRegister = await this.userRepo.findById(id)

    if (!userRegister) return null

    const fullName: string = `${userRegister.firstName} ${userRegister.lastName}`
    const userTypeId = userRegister.userType

    const userResponse: UserResponse = {
      id: userRegister.id,
      fullName: fullName,
      email: userRegister.email,
      userType: await this.userTypeRepo.findById(userTypeId),
    }

    return userResponse
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email)
  }

  async updateUser(
    id: string,
    updates: UpdateUserRequest
  ): Promise<UserResponse | null> {
    const dbUpdates = await mapUpdateUserRequestToDb(updates)

    if (Object.keys(dbUpdates).length === 0) {
      const row = await this.userRepo.findById(id)
      if (!row) return null

      return {
        id: row.id,
        fullName: `${row.firstName} ${row.lastName}`,
        email: row.email,
        userType: await this.userTypeRepo.findById(row.userType),
      }
    }

    try {
      await this.userRepo.update(id, dbUpdates)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null
      }
      throw error
    }

    const row = await this.userRepo.findById(id)

    if (!row) return null

    const userReponse = {
      id: row.id,
      fullName: `${row.firstName} ${row.lastName}`,
      email: row.email,
      userType: await this.userTypeRepo.findById(row.userType),
    }

    return userReponse
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepo.delete(id)
  }
}
