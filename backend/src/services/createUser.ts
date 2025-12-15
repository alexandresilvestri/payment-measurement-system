import { randomUUID } from 'node:crypto'
import type { UserResponse } from '../models/users/users'
import type { User } from '../models/users/users'
import type { IUserRepository } from '../repository/users'
import type { IUserTypeRepository } from '../repository/userTypes'
import { hashPassword } from './passwordHash'
import { ValidationError, NotFoundError } from '../errors'

export type CreateUserParams = {
  firstName: string
  lastName: string
  email: string
  password: string
  typeUser: string
}

function validateName(name: string, fieldName: string): void {
  const trimmed = name.trim()

  if (!trimmed || trimmed.length === 0) {
    throw new ValidationError(`${fieldName} is required`)
  }

  if (trimmed.length < 2 || trimmed.length > 50) {
    throw new ValidationError(`${fieldName} must be between 2 and 50 characters`)
  }

  if (/["'`<>\\;]/.test(trimmed)) {
    throw new ValidationError(`${fieldName} contains invalid characters`)
  }

  if (/\d/.test(trimmed)) {
    throw new ValidationError(`${fieldName} cannot contain numbers`)
  }

  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
    throw new ValidationError(`${fieldName} contains invalid characters`)
  }
}

function validateEmail(email: string): void {
  const trimmed = email.trim()

  if (!trimmed || trimmed.length === 0) {
    throw new ValidationError('Email is required')
  }

  if (trimmed.length > 100) {
    throw new ValidationError('Email must be at most 100 characters')
  }

  if (trimmed.includes("'") || trimmed.includes('"') || trimmed.includes('`')) {
    throw new ValidationError('Email cannot contain quotes')
  }

  if (/[<>\\;()[\]{}|~!#$%^&*=+]/.test(trimmed)) {
    throw new ValidationError('Email contains invalid characters')
  }

  if (/\s/.test(trimmed)) {
    throw new ValidationError('Email cannot contain spaces')
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(trimmed)) {
    throw new ValidationError('Invalid email format')
  }

  if (trimmed.includes('..')) {
    throw new ValidationError('Email cannot contain consecutive dots')
  }
}

function validatePassword(password: string): void {
  if (!password || password.length === 0) {
    throw new ValidationError('Password is required')
  }

  if (password.length < 8 || password.length > 100) {
    throw new ValidationError('Password must be between 8 and 100 characters')
  }

  if (!/[a-z]/.test(password)) {
    throw new ValidationError('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    throw new ValidationError('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    throw new ValidationError('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    throw new ValidationError('Password must contain at least one special character')
  }

  if (/\s/.test(password)) {
    throw new ValidationError('Password cannot contain spaces')
  }
}

export class UserService {
  constructor(
    private userRepo: IUserRepository,
    private userTypeRepo: IUserTypeRepository
  ) {}

  async createUser(params: CreateUserParams): Promise<UserResponse> {
    validateName(params.firstName, 'First name')
    validateName(params.lastName, 'Last name')
    validateEmail(params.email)
    validatePassword(params.password)

    if (!params.typeUser || params.typeUser.trim().length === 0) {
      throw new ValidationError('User type is required')
    }

    const createUserIntent: User = {
      id: randomUUID(),
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      email: params.email.trim().toLowerCase(),
      passwordHash: await hashPassword(params.password),
      userType: params.typeUser,
    }

    await this.userRepo.createUser(createUserIntent)
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
