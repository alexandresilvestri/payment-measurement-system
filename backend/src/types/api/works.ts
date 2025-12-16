export type CreateWorkRequest = {
  name: string
  code?: string
  address: string
  contractor?: string
  status?: 'ATIVA' | 'CONCLUIDA'
}

export type UpdateWorkRequest = {
  name?: string
  code?: string | null
  address?: string
  contractor?: string | null
  status?: 'ATIVA' | 'CONCLUIDA'
}

export type WorkResponse = {
  id: string
  name: string
  code: string | null
  address: string
  contractor: string | null
  status: 'ATIVA' | 'CONCLUIDA'
  createdAt?: Date
  updatedAt?: Date
}

export type WorkListResponse = {
  works: WorkResponse[]
  total: number
}

export type ListWorksQuery = {
  page?: number
  limit?: number
  search?: string
  status?: 'ATIVA' | 'CONCLUIDA'
  contractor?: string
  sortBy?: 'name' | 'code' | 'status' | 'createdAt'
  order?: 'asc' | 'desc'
}
