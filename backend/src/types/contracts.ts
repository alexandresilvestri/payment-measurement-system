import { ContractItem } from './contractItems'

export type Contract = {
  id: string
  workId: string
  supplierId: string
  service: string
  totalValue: number
  startDate: Date
  deliveryTime?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export type CreateContractInput = {
  work: string
  supplier: string
  service: string
  start_date: string
  delivery_time?: string
  items: Omit<ContractItem, 'id' | 'contract' | 'created_at' | 'updated_at'>[]
}

export type CreateContractInputRepository = CreateContractInput & {
  id: string
  totalValue: number
  items: ContractItem[]
}
