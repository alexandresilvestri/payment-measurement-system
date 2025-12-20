import { z } from 'zod'

export const createSupplierSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, 'Name is required'),
      typePerson: z.enum(['FISICA', 'JURIDICA'], {
        message: 'Type of person must be FISICA or JURIDICA',
      }),
      document: z.string().trim().min(1, 'Document is required'),
    })
    .refine(
      (data) => {
        if (data.typePerson === 'FISICA') {
          return data.document.length >= 11
        }
        if (data.typePerson === 'JURIDICA') {
          return data.document.length >= 14
        }
        return true
      },
      {
        message:
          'Document must have at least 11  characters for FISICA (CPF), of 14 for JURIDICA (CNPJ)',
        path: ['document'],
      }
    ),
})
