import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, Select } from '../components/UI'
import { UserPlus } from 'lucide-react'
import { z } from 'zod'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const nameValidator = (value: string, fieldName: string) => {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return `O campo ${fieldName} é obrigatório`
  }

  if (trimmed.length < 2) {
    return `O ${fieldName} deve ter pelo menos 2 caracteres`
  }

  if (trimmed.length > 50) {
    return `O ${fieldName} deve ter no máximo 50 caracteres`
  }

  if (/\d/.test(trimmed)) {
    return `O ${fieldName} não pode conter números`
  }

  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
    return `O ${fieldName} contém caracteres inválidos`
  }

  if (trimmed.length !== trimmed.replace(/\s+/g, ' ').length) {
    return `O ${fieldName} não pode ter espaços múltiplos`
  }

  return true
}

const emailValidator = (value: string) => {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return 'O campo E-mail é obrigatório'
  }

  if (trimmed.length > 100) {
    return 'O e-mail deve ter no máximo 100 caracteres'
  }

  if (trimmed.includes("'") || trimmed.includes('"') || trimmed.includes('`')) {
    return 'E-mail inválido: não pode conter aspas'
  }

  const dangerousChars = /[<>\\;()[\]{}|~!#$%^&*=+]/
  if (dangerousChars.test(trimmed)) {
    return 'E-mail inválido: contém caracteres não permitidos'
  }

  if (/\s/.test(trimmed)) {
    return 'E-mail inválido: não pode conter espaços'
  }

  const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!strictEmailRegex.test(trimmed)) {
    return 'Formato de e-mail inválido. Use o formato: exemplo@dominio.com'
  }

  if (trimmed.includes('..')) {
    return 'E-mail inválido: não pode conter pontos consecutivos'
  }

  if (trimmed.startsWith('.') || trimmed.endsWith('.')) {
    return 'E-mail inválido: não pode começar ou terminar com ponto'
  }

  const [localPart, domain] = trimmed.split('@')

  if (localPart.length === 0) {
    return 'E-mail inválido: parte antes do @ não pode estar vazia'
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'E-mail inválido: parte local não pode começar ou terminar com ponto'
  }

  if (localPart.startsWith('-') || localPart.endsWith('-')) {
    return 'E-mail inválido: parte local não pode começar ou terminar com hífen'
  }

  if (domain.length === 0 || !domain.includes('.')) {
    return 'E-mail inválido: domínio incompleto'
  }

  if (domain.startsWith('.') || domain.endsWith('.')) {
    return 'E-mail inválido: domínio não pode começar ou terminar com ponto'
  }

  if (domain.startsWith('-') || domain.endsWith('-')) {
    return 'E-mail inválido: domínio não pode começar ou terminar com hífen'
  }

  const domainParts = domain.split('.')
  if (domainParts.some((part) => part.length === 0)) {
    return 'E-mail inválido: domínio mal formatado'
  }

  const domainRegex = /^[a-zA-Z0-9-]+$/
  if (domainParts.some((part) => !domainRegex.test(part))) {
    return 'E-mail inválido: domínio contém caracteres inválidos'
  }

  const tld = domainParts[domainParts.length - 1]
  if (tld.length < 2) {
    return 'E-mail inválido: extensão do domínio muito curta'
  }

  return true
}

const passwordValidator = (value: string) => {
  if (value.length === 0) {
    return 'O campo Senha é obrigatório'
  }

  if (value.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres'
  }

  if (value.length > 100) {
    return 'A senha deve ter no máximo 100 caracteres'
  }

  if (!/[a-z]/.test(value)) {
    return 'A senha deve conter pelo menos uma letra minúscula'
  }

  if (!/[A-Z]/.test(value)) {
    return 'A senha deve conter pelo menos uma letra maiúscula'
  }

  if (!/\d/.test(value)) {
    return 'A senha deve conter pelo menos um número'
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    return 'A senha deve conter pelo menos um caractere especial (!@#$%^&* etc.)'
  }

  if (/\s/.test(value)) {
    return 'A senha não pode conter espaços'
  }

  return true
}

const registerSchema = z
  .object({
    firstName: z.string().superRefine((val, ctx) => {
      const result = nameValidator(val.trim(), 'nome')
      if (result !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result,
        })
      }
    }),
    lastName: z.string().superRefine((val, ctx) => {
      const result = nameValidator(val.trim(), 'sobrenome')
      if (result !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result,
        })
      }
    }),
    email: z.string().superRefine((val, ctx) => {
      const result = emailValidator(val.trim())
      if (result !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result,
        })
      }
    }),
    password: z.string().superRefine((val, ctx) => {
      const result = passwordValidator(val)
      if (result !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result,
        })
      }
    }),
    confirmPassword: z.string().min(1, 'A confirmação de senha é obrigatória'),
    userType: z.string().min(1, 'O campo Tipo de Usuário é obrigatório'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

type UserType = {
  id: string
  name: string
}

export const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({})
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axios.get<UserType[]>(
          `${API_BASE_URL}/user-types`
        )
        setUserTypes(response.data)
      } catch (error) {
        console.error('Erro ao carregar tipos de usuário:', error)
        setApiError('Erro ao carregar tipos de usuário')
      }
    }

    fetchUserTypes()
  }, [])

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    setSuccessMessage('')
    setApiError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    setApiError('')

    const result = registerSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      const { ...validatedData } = result.data
      const submitData = {
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        email: validatedData.email.trim().toLowerCase(),
        password: validatedData.password,
        userType: validatedData.userType,
      }
      await axios.post(`${API_BASE_URL}/users`, submitData)

      setSuccessMessage(
        'Usuário cadastrado com sucesso! Redirecionando para o login...'
      )

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: '',
      })

      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || ''
        const errorStatus = error.response?.status

        if (
          errorStatus === 409 ||
          errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('já existe') ||
          errorMessage.toLowerCase().includes('duplicate')
        ) {
          setErrors({ email: 'Este e-mail já está cadastrado no sistema' })
          setApiError(
            'O e-mail informado já está em uso. Por favor, utilize outro e-mail.'
          )
        } else if (errorStatus === 400) {
          setApiError('Dados inválidos. Verifique os campos e tente novamente.')
        } else if (errorStatus === 500) {
          setApiError('Erro no servidor. Tente novamente mais tarde.')
        } else {
          setApiError(
            errorMessage || 'Erro ao cadastrar usuário. Tente novamente.'
          )
        }
      } else {
        setApiError(
          'Erro inesperado ao cadastrar usuário. Verifique sua conexão e tente novamente.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const userTypeOptions = userTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgMain px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
            C
          </div>
          <h1 className="text-3xl font-bold text-textMain tracking-tight">
            CONFERIR
          </h1>
          <p className="text-textSec mt-2">Cadastro de Novo Usuário</p>
        </div>

        <Card className="shadow-lg border-0">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Input
                label="Nome"
                placeholder="Digite seu nome"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                disabled={isLoading}
                maxLength={50}
              />
              <div className="text-xs text-textSec mt-1">
                {formData.firstName.length}/50 caracteres
              </div>
            </div>

            <div>
              <Input
                label="Sobrenome"
                placeholder="Digite seu sobrenome"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                disabled={isLoading}
                maxLength={50}
              />
              <div className="text-xs text-textSec mt-1">
                {formData.lastName.length}/50 caracteres
              </div>
            </div>

            <div>
              <Input
                label="E-mail"
                type="email"
                placeholder="nome@empresa.com.br"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                disabled={isLoading}
                maxLength={100}
              />
              <div className="text-xs text-textSec mt-1">
                {formData.email.length}/100 caracteres
              </div>
            </div>

            <div>
              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                disabled={isLoading}
                maxLength={100}
              />
              {!errors.password && formData.password.length === 0 && (
                <div className="text-xs text-textSec mt-1 space-y-0.5">
                  <div>A senha deve conter:</div>
                  <ul className="list-disc list-inside ml-2">
                    <li>Mínimo de 8 caracteres</li>
                    <li>Letra maiúscula e minúscula</li>
                    <li>Pelo menos um número</li>
                    <li>Pelo menos um caractere especial (!@#$%^&*)</li>
                  </ul>
                </div>
              )}
              {formData.password.length > 0 && (
                <div className="text-xs mt-1 space-y-1">
                  <div
                    className={
                      formData.password.length >= 8
                        ? 'text-green-600'
                        : 'text-textSec'
                    }
                  >
                    {formData.password.length >= 8 ? '✓' : '○'} Mínimo 8
                    caracteres
                  </div>
                  <div
                    className={
                      /[a-z]/.test(formData.password) &&
                      /[A-Z]/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-textSec'
                    }
                  >
                    {/[a-z]/.test(formData.password) &&
                    /[A-Z]/.test(formData.password)
                      ? '✓'
                      : '○'}{' '}
                    Maiúscula e minúscula
                  </div>
                  <div
                    className={
                      /\d/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-textSec'
                    }
                  >
                    {/\d/.test(formData.password) ? '✓' : '○'} Número
                  </div>
                  <div
                    className={
                      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                        formData.password
                      )
                        ? 'text-green-600'
                        : 'text-textSec'
                    }
                  >
                    {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                      formData.password
                    )
                      ? '✓'
                      : '○'}{' '}
                    Caractere especial
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Digite sua senha novamente"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              disabled={isLoading}
              maxLength={100}
            />

            <Select
              label="Tipo de Usuário"
              placeholder="Selecione o tipo de usuário"
              options={userTypeOptions}
              value={formData.userType}
              onChange={(e) => handleChange('userType', e.target.value)}
              error={errors.userType}
              disabled={isLoading}
            />

            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-200 text-green-700 rounded-[4px] text-sm">
                {successMessage}
              </div>
            )}

            {apiError && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-[4px] text-sm">
                {apiError}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                icon={UserPlus}
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar Usuário'}
              </Button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-textSec hover:text-textMain transition-colors"
                disabled={isLoading}
              >
                Voltar para o Login
              </button>
            </div>
          </form>
        </Card>

        <p className="text-center text-xs text-textSec mt-8">
          &copy; 2025 Conferir Systems. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
