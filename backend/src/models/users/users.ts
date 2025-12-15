import { UserTypeDatabaseRow } from './userTypes'

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

export type UserDatabaseRow = {
  id: string
  email: string
  password: string
  type_user_id: string
}
