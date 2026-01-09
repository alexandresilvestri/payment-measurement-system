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
  linkedConstructionSiteIds?: string[]
}

export interface ConstructionSite {
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

export interface LegacySupplier {
  id: string
  corporateName: string
  cnpj: string
  bankInfo: string
}

export interface ContractItem {
  id: string
  contractId: string
  description: string
  unit: string
  quantityContracted: number
  unitPriceMaterial: number
  unitPriceLabor: number
  unitPriceTotal: number
  totalValue: number
}

export interface Contract {
  id: string
  constructionSiteId: string
  supplierId: string
  object: string
  totalValue: number
  startDate: string
  endDate: string
  status: 'ATIVO' | 'ENCERRADO'
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
  createdAt: string // ISO Date
  createdByUserId: string
  status: MeasurementStatus
  siteObservation?: string
  directorObservation?: string
  totalValue: number
  items: MeasurementItem[]
}

export interface EnrichedMeasurement extends Measurement {
  contract: Contract
  site: ConstructionSite
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
