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

export type SupplierDatabaseRow = {
  id: string
  name: string
  type_person: 'FISICA' | 'JURIDICA'
  document: string
  pix?: string
  created_at: Date
  updated_at: Date
}

export type ContractDatabaseRow = {
  id: string
  work: string
  supplier: string
  service: string
  total_value: number
  start_date: Date
  delivery_time: Date | null
}

export type RefreshTokenDatabaseRow = {
  id: string
  user_id: string
  token: string
  expires_at: Date
  created_at: Date
  revoked_at: Date | null
}
