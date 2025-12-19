export type Work = {
  id: string
  name: string
  code: number
  address: string
  contractor: string | null
  status: 'ATIVA' | 'CONCLUIDA'
}

export type CreateWorkRequest = {
  name: string
  address: string
  contractor?: string
  status?: 'ATIVA' | 'CONCLUIDA'
}

export type UpdateWorkRequest = {
  name?: string
  address?: string
  contractor?: string | null
  status?: 'ATIVA' | 'CONCLUIDA'
}
