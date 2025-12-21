import { randomUUID } from 'node:crypto'
import { Supplier } from '../types/supplier'
import { ISupplierRepository } from '../repository/suppliers'
import { NotFoundError } from '../errors'
import { UpdateSupplierRequest } from '../types/api/supplier'
import { mapUpdateSupplierRequestToDb } from '../utils/mappers/supplierMapper'

export type CreateSupplierParams = {
  name: string
  typePerson: 'FISICA' | 'JURIDICA'
  document: string
  pix?: string
}

export class SupplierService {
  constructor(private supplierRepo: ISupplierRepository) {}

  async createSupplier(params: CreateSupplierParams): Promise<Supplier> {
    const createSupplierIntent: Supplier = {
      id: randomUUID(),
      name: params.name.trim(),
      typePerson: params.typePerson,
      document: params.document.trim(),
      pix: params.pix?.trim(),
    }

    await this.supplierRepo.create(createSupplierIntent)
    const createdSupplier = await this.supplierRepo.findById(
      createSupplierIntent.id
    )

    if (!createdSupplier) throw new NotFoundError('Failed to create Supplier')

    return createdSupplier
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    const supplier = await this.supplierRepo.findById(id)

    if (!supplier) return null

    return supplier
  }

  async getAllSuppliers(): Promise<Supplier[] | null> {
    const suppliers = await this.supplierRepo.findAll()

    if (!suppliers) return []

    return suppliers
  }

  async updateSupplier(
    id: string,
    updates: UpdateSupplierRequest
  ): Promise<Supplier | null> {
    const dbUpdates = mapUpdateSupplierRequestToDb(updates)

    await this.supplierRepo.update(id, dbUpdates)

    const updatedSupplier = await this.supplierRepo.findById(id)

    if (!updatedSupplier) throw new NotFoundError('Supplier not found')

    return updatedSupplier
  }

  async deleteSupplier(id: string): Promise<void> {
    await this.supplierRepo.delete(id)
  }
}
