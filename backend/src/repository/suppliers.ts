import type { Supplier } from '../types/supplier'
import type { SupplierDatabaseRow } from '../types/database'
import { BaseRepository } from './BaseRepository'
import { duplicateError } from '../utils/duplicateValueError'

export interface ISupplierRepository {
  create(supplier: Supplier): Promise<void>
  findById(id: string): Promise<Supplier | null>
}

class SupplierRepository
  extends BaseRepository<Supplier, SupplierDatabaseRow>
  implements ISupplierRepository
{
  constructor() {
    super('suppliers')
  }

  async create(supplier: Supplier): Promise<void> {
    try {
      await super.create(supplier)
    } catch (err) {
      duplicateError(err, 'suppliers', 'name')
      duplicateError(err, 'suppliers', 'document')
      duplicateError(err, 'suppliers', 'pix')

      throw err
    }
  }

  protected toDatabase(data: Supplier): SupplierDatabaseRow {
    return {
      id: data.id,
      name: data.name,
      type_person: data.typePerson,
      document: data.document,
      pix: data.pix,
    }
  }

  protected toDomain(row: SupplierDatabaseRow): Supplier {
    return {
      id: row.id,
      name: row.name,
      typePerson: row.type_person,
      document: row.document,
      pix: row.pix,
    }
  }
}

export const supplierRepository = new SupplierRepository()
