import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O campo E-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .max(100, 'E-mail muito longo'),
  password: z.string().min(1, 'O campo Senha é obrigatório'),
})

export type LoginFormData = z.infer<typeof loginSchema>
