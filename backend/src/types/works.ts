export type Work = {
  id: string
  name: string
  code: string | null
  address: string
  contractor: string | null
  status: 'ATIVA' | 'CONCLUIDA'
}
