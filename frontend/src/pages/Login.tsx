import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Card } from '../components/UI'

export const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Email ou senha inválidos. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgMain px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-textMain tracking-tight">
            CONFERIR
          </h1>
          <p className="text-textSec mt-2">Sistema de Gestão de Medições</p>
        </div>

        <Card className="shadow-lg border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="E-mail Corporativo"
                placeholder="nome@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || isLoading}
                required
              />
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || isLoading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || isLoading}
            >
              {loading || isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/register')}
            className="text-sm text-textSec hover:text-textMain transition-colors"
          >
            Não tem uma conta? Cadastre-se
          </button>
        </div>

        <p className="text-center text-xs text-textSec mt-8">
          &copy; 2025 Conferir Systems. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
