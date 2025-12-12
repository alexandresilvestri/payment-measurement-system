export type User = {
  id: string
  email: string
  passwordHash: string
}

export type UserResponse = {
  id: string
  email: string
}

export type UserDatabaseRow = {
  id: string
  email: string
  password: string
}
