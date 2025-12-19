import { Supplier } from '../supplier'

export type CreateSupplierRequest = {
  name: string
  typePerson: 'FISICA' | 'JURIDICA'
  document: string
  pix?: string
}

export type UpdateSupplierRequest = {
  name?: string
  typePerson?: 'FISICA' | 'JURIDICA'
  document?: string
  pix?: string
}

export type SupplierListResponse = {
  suppliers: Supplier[]
  total: number
}
