import { UserTypeDatabaseRow } from '../userTypes'

export type CreateUserRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  typeUser: string
}

export type UpdateUserRequest = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  typeUser?: string
}

export type UserResponse = {
  id: string
  fullName: string
  email: string
  userType: UserTypeDatabaseRow | null
}

export type UserListResponse = {
  users: UserResponse[]
  total: number
}

export type ListUsersQuery = {
  page?: number
  limit?: number
  search?: string
  userType?: string
  sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt'
  order?: 'asc' | 'desc'
}
