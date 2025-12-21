import { z } from 'zod'

const nameSchema = z
  .string()
  .trim()
  .min(3, 'Name must be between 3 and 60 characters')
  .max(60, 'Name must be between 3 and 60 characters')

const typePersonSchema = z.enum(['FISICA', 'JURIDICA'], {
  message: 'Type of person must be FISICA or JURIDICA',
})

const documentSchema = z.string().trim().min(1, 'Document is required')

const pixSchema = z
  .string()
  .trim()
  .min(8, 'PIX must be between 8 and 45 characters')
  .max(45, 'PIX must be between 8 and 45 characters')
  .optional()

export const createSupplierSchema = z.object({
  body: z
    .object({
      name: nameSchema,
      typePerson: typePersonSchema,
      document: documentSchema,
      pix: pixSchema,
    })
    .refine(
      (data) => {
        if (data.typePerson === 'FISICA') {
          return data.document.length === 11
        }
        if (data.typePerson === 'JURIDICA') {
          return data.document.length === 14
        }
        return true
      },
      {
        message:
          'Document must have exactly 11 characters for FISICA (CPF), or 14 for JURIDICA (CNPJ)',
        path: ['document'],
      }
    ),
})

export const getSupplierSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid supplier ID'),
  }),
})

export const updateSupplierSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid supplier ID'),
  }),
  body: z
    .object({
      name: nameSchema.optional(),
      typePerson: typePersonSchema.optional(),
      document: documentSchema.optional(),
      pix: pixSchema,
    })
    .refine(
      (data) => {
        if (data.document && data.typePerson) {
          if (data.typePerson === 'FISICA') {
            return data.document.length === 11
          }
          if (data.typePerson === 'JURIDICA') {
            return data.document.length === 14
          }
        }
        return true
      },
      {
        message:
          'Document must have exactly 11 characters for FISICA (CPF), or 14 for JURIDICA (CNPJ)',
        path: ['document'],
      }
    )
    .refine(
      (data) => {
        if (data.document && !data.typePerson) {
          return false
        }
        return true
      },
      {
        message: 'typePerson is required when updating document',
        path: ['typePerson'],
      }
    ),
})

export const deleteSupplierSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid supplier ID'),
  }),
})
