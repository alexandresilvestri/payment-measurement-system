import { UserTypeDatabaseRow } from './userTypes'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  userType: string
}

export type UserResponse = {
  id: string
  fullName: string
  email: string
  userType: UserTypeDatabaseRow | null
}

export type Permission = {
  id: string
  name: string
  module: string
}

export type TypeUserPermissions = {
  typeUserId: string
  permissionId: string
}
