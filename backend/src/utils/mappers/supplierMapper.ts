import { UpdateSupplierRequest } from '../../types/api/supplier.js'

export function mapUpdateSupplierRequestToDb(updates: UpdateSupplierRequest): {
  name?: string
  type_person?: 'FISICA' | 'JURIDICA'
  document?: string
  pix?: string
} {
  const dbUpdates: {
    name?: string
    type_person?: 'FISICA' | 'JURIDICA'
    document?: string
    pix?: string
  } = {}

  if (updates.name !== undefined) {
    dbUpdates.name = updates.name.trim()
  }
  if (updates.typePerson !== undefined) {
    dbUpdates.type_person = updates.typePerson
  }
  if (updates.document !== undefined) {
    dbUpdates.document = updates.document.trim()
  }
  if (updates.pix !== undefined) {
    dbUpdates.pix = updates.pix.trim()
  }

  return dbUpdates
}
