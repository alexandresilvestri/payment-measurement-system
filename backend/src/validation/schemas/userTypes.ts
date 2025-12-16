import { z } from 'zod'

export const createUserTypeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
  }),
})

export const getUserTypeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user type ID'),
  }),
})

export const updateUserTypeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user type ID'),
  }),
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').optional(),
  }),
})

export const deleteUserTypeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user type ID'),
  }),
})
