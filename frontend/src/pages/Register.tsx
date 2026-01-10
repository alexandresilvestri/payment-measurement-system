import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, PasswordInput, Card, Select } from '../components/UI'
import { UserPlus } from 'lucide-react'
import { FetchClient, isFetchError } from '../lib/fetchClient'
import {
  registerSchema,
  type RegisterFormData,
} from '../validations/userRegisterValidation'

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`
const client = new FetchClient({ baseURL: API_BASE_URL })

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
        const response = await client.get<UserType[]>('/user-types')
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
      await client.post('/users', submitData)

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
      if (isFetchError(error)) {
        const errorMessage =
          (error.response?.data as { message?: string })?.message || ''
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
    <div className="min-h-screen bg-bgMain flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                ✓
              </div>
              <h1 className="text-2xl font-bold text-textMain tracking-tight">
                CONFERIR
              </h1>
              <p className="text-sm text-textSec mt-1">
                Cadastro de Novo Usuário
              </p>
            </div>

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
              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                disabled={isLoading}
                maxLength={100}
              />
              {errors.password && (
                <div className="text-xs mt-1 space-y-1">
                  <div
                    className={
                      formData.password.length >= 8
                        ? 'text-green-600'
                        : 'text-textSec'
                    }
                  >
                    {formData.password.length >= 8 ? '[x]' : '[ ]'} Mínimo 8
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
                      ? '[x]'
                      : '[ ]'}{' '}
                    Maiúscula e minúscula
                  </div>
                  <div
                    className={
                      /\d/.test(formData.password)
                        ? 'text-green-600'
                        : 'text-textSec'
                    }
                  >
                    {/\d/.test(formData.password) ? '[x]' : '[ ]'} Número
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
                      ? '[x]'
                      : '[ ]'}{' '}
                    Caractere especial
                  </div>
                </div>
              )}
            </div>

            <PasswordInput
              label="Confirmar Senha"
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
