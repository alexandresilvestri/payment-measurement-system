import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { AuthUser, AuthContextType } from '../types/auth'
import { authService } from '../services/authService'
import { tokenStorage } from '../utils/tokenStorage'
import { setupInterceptors } from '../pages/services/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      setAccessToken(null)
      setRefreshToken(null)
      tokenStorage.clearAll()
    }
  }, [refreshToken])

  const refreshAccessToken = useCallback(async (): Promise<void> => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken)
      const newAccessToken = response.accessToken

      setAccessToken(newAccessToken)
      tokenStorage.setAccessToken(newAccessToken)
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      throw error
    }
  }, [refreshToken, logout])

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = tokenStorage.getUser()
        const storedAccessToken = tokenStorage.getAccessToken()
        const storedRefreshToken = tokenStorage.getRefreshToken()

        if (storedUser && storedAccessToken && storedRefreshToken) {
          setUser(storedUser)
          setAccessToken(storedAccessToken)
          setRefreshToken(storedRefreshToken)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        tokenStorage.clearAll()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    setupInterceptors(() => tokenStorage.getAccessToken(), refreshAccessToken)
  }, [accessToken, refreshAccessToken])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({ email, password })

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: newUser,
      } = response

      setUser(newUser)
      setAccessToken(newAccessToken)
      setRefreshToken(newRefreshToken)

      tokenStorage.setTokens(newAccessToken, newRefreshToken, newUser)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
