import { z } from 'zod'

const workId = z.uuid({ version: 'v4' })
const supplierId = z.uuid({ version: 'v4' })
const service = z
  .string()
  .trim()
  .max(255, 'Description must be max 255 characters')
const startDate = z.coerce.date({
  message: 'Start date must be a valid date',
})
const deliveryTime = z.coerce
  .date({
    message: 'Delivery time must be a valid date',
  })
  .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Delivery time cannot be in the past',
  })
  .optional()
  .nullable()

export const createContractSchema = z.object({
  body: z.object({
    workId: workId,
    supplierId: supplierId,
    service: service,
    startDate: startDate,
    deliveryTime: deliveryTime,
  }),
})

export const getContractSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid contract ID'),
  }),
})

export type CreateContractInput = z.infer<typeof createContractSchema>
