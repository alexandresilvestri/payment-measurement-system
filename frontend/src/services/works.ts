import { ConstructionSite } from '../types'
import { api } from './api'

export const worksApi = {
  getAll: async (): Promise<ConstructionSite[]> => {
    const response = await api.get<ConstructionSite[]>('/works')
    return response.data
  },

  getById: async (id: string): Promise<ConstructionSite> => {
    const response = await api.get<ConstructionSite>(`/works/${id}`)
    return response.data
  },

  create: async (
    data: Omit<ConstructionSite, 'id' | 'createdAt' | 'updatedAt' | 'code'>
  ): Promise<ConstructionSite> => {
    const response = await api.post<ConstructionSite>('/works', data)
    return response.data
  },

  update: async (
    id: string,
    data: Partial<Omit<ConstructionSite, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ConstructionSite> => {
    const response = await api.put<ConstructionSite>(`/works/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/works/${id}`)
  },
}
