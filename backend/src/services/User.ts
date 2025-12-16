import { randomUUID } from 'node:crypto'
import type { UserResponse } from '../types/users'
import type { User } from '../types/users'
import type { IUserRepository } from '../repository/users'
import type { IUserTypeRepository } from '../repository/userTypes'
import { hashPassword } from '../utils/passwordHash'
import { NotFoundError } from '../errors'

export type CreateUserParams = {
  firstName: string
  lastName: string
  email: string
  password: string
  typeUser: string
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
      userType: params.typeUser,
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

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepo.findById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email)
  }
}
