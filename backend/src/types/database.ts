export type UserDatabaseRow = {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  type_user_id: string
}

export type UserTypeDatabaseRow = {
  id: string
  name: string
}

export type WorkDatabaseRow = {
  id: string
  name: string
  code: string | null
  address: string
  contractor: string | null
  status: 'ATIVA' | 'CONCLUIDA'
  created_at?: Date
  updated_at?: Date
}
