import { Supplier } from '../../types'
import { api } from './api'

export interface CreateSupplierRequest {
  name: string
  typePerson: 'FISICA' | 'JURIDICA'
  document: string
  pix?: string
}

export interface UpdateSupplierRequest {
  name?: string
  typePerson?: 'FISICA' | 'JURIDICA'
  document?: string
  pix?: string
}

export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>('/suppliers')
    return response.data
  },

  getById: async (id: string): Promise<Supplier> => {
    const response = await api.get<Supplier>(`/suppliers/${id}`)
    return response.data
  },

  create: async (data: CreateSupplierRequest): Promise<Supplier> => {
    const response = await api.post<Supplier>('/suppliers', data)
    return response.data
  },

  update: async (
    id: string,
    data: UpdateSupplierRequest
  ): Promise<Supplier> => {
    const response = await api.put<Supplier>(`/suppliers/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/suppliers?id=${id}`)
  },
}
