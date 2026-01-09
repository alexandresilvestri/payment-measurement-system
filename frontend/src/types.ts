export type UserRole = 'DIRETOR' | 'OBRA'

export type MeasurementStatus =
  | 'RASCUNHO'
  | 'PENDENTE'
  | 'APROVADA'
  | 'REPROVADA'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface Work {
  id: string
  name: string
  code?: string
  address: string
  contractor?: string
  status: 'ATIVA' | 'CONCLUIDA'
  createdAt?: string
  updatedAt?: string
}

export interface Supplier {
  id: string
  name: string
  typePerson: 'FISICA' | 'JURIDICA'
  document: string
  pix?: string
  createdAt?: string
  updatedAt?: string
}

export interface ContractItem {
  id: string
  contractId: string
  description: string
  unitMeasure: string
  quantity: number
  unitLaborValue: number
  totalValue: number
}

export interface Contract {
  id: string
  workId: string
  supplierId: string
  service: string
  totalValue: number
  startDate: Date
  deliveryTime: Date | null
  status: 'Ativo' | 'Encerrado'
  items: ContractItem[]
}

export interface MeasurementItem {
  id: string
  measurementId: string
  contractItemId: string
  currentQuantity: number
  unitPrice: number
  totalValue: number
}

export interface Measurement {
  id: string
  contractId: string
  number: number
  createdAt: string
  createdByUserId: string
  status: MeasurementStatus
  siteObservation?: string
  directorObservation?: string
  totalValue: number
  items: MeasurementItem[]
}

export interface EnrichedMeasurement extends Measurement {
  contract: Contract
  work: Work
  supplier: Supplier
  creatorName: string
}

export interface ContractListItem {
  id: string
  work: { id: string; name: string }
  supplier: { id: string; name: string }
  service: string
  totalValue: number
  startDate: string
  deliveryTime: string | null
  status: 'Ativo' | 'Encerrado'
  percentage: number
}
