import { UserTypeDatabaseRow } from './userDatabase/userTypes'

export type User = {
  id: string
  email: string
  passwordHash: string
  userType: string
}

export type UserResponse = {
  id: string
  email: string
  userType: UserTypeDatabaseRow | null
}
