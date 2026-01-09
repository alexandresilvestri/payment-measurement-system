import { ContractListItem } from '../../types'
import { api } from './api'

export const contractsApi = {
  getAll: async (filters?: {
    workId?: string
    supplierId?: string
  }): Promise<ContractListItem[]> => {
    const params = new URLSearchParams()
    if (filters?.workId) params.append('workId', filters.workId)
    if (filters?.supplierId) params.append('supplierId', filters.supplierId)

    const url = `/contracts${params.toString() ? `?${params}` : ''}`
    const response = await api.get<ContractListItem[]>(url)
    return response.data
  },
}
