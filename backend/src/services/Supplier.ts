import { randomUUID } from 'node:crypto'
import { Supplier } from '../types/supplier'
import { ISupplierRepository } from '../repository/suppliers'
import { NotFoundError } from '../errors'

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
}
