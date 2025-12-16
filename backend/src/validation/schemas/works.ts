import { z } from 'zod'

export const createWorkSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    code: z.string().trim().optional(),
    address: z.string().trim().min(1, 'Address is required'),
    contractor: z.string().trim().optional(),
    status: z.enum(['ATIVA', 'CONCLUIDA']).optional(),
  }),
})

export const getWorkSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid work ID'),
  }),
})

export const updateWorkSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid work ID'),
  }),
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').optional(),
    code: z.string().trim().nullable().optional(),
    address: z.string().trim().min(1, 'Address is required').optional(),
    contractor: z.string().trim().nullable().optional(),
    status: z.enum(['ATIVA', 'CONCLUIDA']).optional(),
  }),
})

export const deleteWorkSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid work ID'),
  }),
})
