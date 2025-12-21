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
  approve_measurement: boolean
  created_at?: Date
  updated_at?: Date
}

export type WorkDatabaseRow = {
  id: string
  name: string
  code: number
  address: string
  contractor: string | null
  status: 'ATIVA' | 'CONCLUIDA'
  created_at?: Date
  updated_at?: Date
}
