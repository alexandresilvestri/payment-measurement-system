export type Work = {
  id: string
  name: string
  code: string | null
  address: string
  contractor: string | null
  status: 'ATIVA' | 'CONCLUIDA'
}

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
