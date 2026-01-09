import { ContractListItem } from '../../types'
import { api } from './api'

export type CreateContractRequest = {
  workId: string
  supplierId: string
  service: string
  startDate: string
  deliveryTime?: string
  items: {
    description: string
    unitMeasure: string
    quantity: number
    unitLaborValue: number
  }[]
}

export type ContractResponse = {
  id: string
  work: { id: string; name: string } | null
  supplier: { id: string; name: string } | null
  service: string
  totalValue: number
  startDate: Date
  deliveryTime: Date | null
  status: string
  items: {
    id: string
    contractId: string
    description: string
    unitMeasure: string
    quantity: number
    unitLaborValue: number
    totalValue: number
  }[]
}

export const contractsApi = {
  create: async (data: CreateContractRequest): Promise<ContractResponse> => {
    const response = await api.post<ContractResponse>('/contracts', data)
    return response.data
  },

  getAll: async (filters?: {
    workId?: string
    supplierId?: string
  }): Promise<ContractListItem[]> => {
    const params = new URLSearchParams()
    if (filters?.workId) params.append('workId', filters.workId)
    if (filters?.supplierId) params.append('supplierId', filters.supplierId)

    const queryString = params.toString()
    const url = queryString
      ? `/contracts/details?${queryString}`
      : '/contracts/details'
    const response = await api.get<ContractListItem[]>(url)
    return response.data
  },

  getById: async (id: string): Promise<ContractResponse> => {
    const response = await api.get<ContractResponse>(`/contracts/${id}`)
    return response.data
  },
}
