import { z } from 'zod'

const nameSchema = z
  .string()
  .trim()
  .min(1, 'is required')
  .min(2, 'must be between 2 and 50 characters')
  .max(50, 'must be between 2 and 50 characters')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'contains invalid characters')
  .refine((val) => !/\d/.test(val), 'cannot contain numbers')
  .refine((val) => !/["'`<>\\;]/.test(val), 'contains invalid characters')

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(100, 'Email must be at most 100 characters')
  .email('Invalid email format')
  .refine((val) => !/\s/.test(val), 'Email cannot contain spaces')
  .refine(
    (val) => !val.includes("'") && !val.includes('"') && !val.includes('`'),
    'Email cannot contain quotes'
  )
  .refine(
    (val) => !/[<>\\;()[\]{}|~!#$%^&*=+]/.test(val),
    'Email contains invalid characters'
  )
  .refine((val) => !val.includes('..'), 'Email cannot contain consecutive dots')
  .refine(
    (val) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
    'Invalid email format'
  )

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be between 8 and 100 characters')
  .max(100, 'Password must be between 8 and 100 characters')
  .refine(
    (val) => /[a-z]/.test(val),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (val) => /[A-Z]/.test(val),
    'Password must contain at least one uppercase letter'
  )
  .refine((val) => /\d/.test(val), 'Password must contain at least one number')
  .refine(
    (val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
    'Password must contain at least one special character'
  )
  .refine((val) => !/\s/.test(val), 'Password cannot contain spaces')

export const createUserSchema = z.object({
  body: z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    userType: z.string().trim().min(1, 'User type is required'),
  }),
})

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    userType: z.string().trim().min(1, 'User type is required').optional(),
  }),
})

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
})
