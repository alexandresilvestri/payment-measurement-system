import { Work } from '../../types'
import { api } from './api'

export const worksApi = {
  getAll: async (): Promise<Work[]> => {
    const response = await api.get<Work[]>('/works')
    return response.data
  },

  getById: async (id: string): Promise<Work> => {
    const response = await api.get<Work>(`/works/${id}`)
    return response.data
  },

  create: async (
    data: Omit<Work, 'id' | 'createdAt' | 'updatedAt' | 'code'>
  ): Promise<Work> => {
    const response = await api.post<Work>('/works', data)
    return response.data
  },

  update: async (
    id: string,
    data: Partial<Omit<Work, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Work> => {
    const response = await api.put<Work>(`/works/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/works/${id}`)
  },
}
