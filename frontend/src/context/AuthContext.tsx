import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react'
import { AuthUser, AuthContextType } from '../types/auth'
import { authService } from '../services/authService'
import { tokenStorage } from '../utils/tokenStorage'
import { setupInterceptors } from '../pages/services/api'
import { getTimeUntilExpiration } from '../utils/jwtDecode'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimerRef = useRef<number | null>(null)

  const isAuthenticated = !!user

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    clearRefreshTimer()
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
  }, [refreshToken, clearRefreshTimer])

  const refreshAccessToken = useCallback(async (): Promise<void> => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken)
      const newAccessToken = response.accessToken

      setAccessToken(newAccessToken)
      tokenStorage.setAccessToken(newAccessToken)

      clearRefreshTimer()
      const timeUntilExpiration = getTimeUntilExpiration(newAccessToken)
      const refreshBuffer = 60 * 1000
      const refreshTime = Math.max(0, timeUntilExpiration - refreshBuffer)

      refreshTimerRef.current = window.setTimeout(() => {
        refreshAccessToken().catch((error) => {
          console.error('Automatic token refresh failed:', error)
        })
      }, refreshTime)
    } catch (error) {
      console.error('Token refresh failed:', error)
      await logout()
      throw error
    }
  }, [refreshToken, logout, clearRefreshTimer])

  const scheduleTokenRefresh = useCallback(
    (token: string) => {
      clearRefreshTimer()

      const timeUntilExpiration = getTimeUntilExpiration(token)

      const refreshBuffer = 60 * 1000
      const refreshTime = Math.max(0, timeUntilExpiration - refreshBuffer)

      refreshTimerRef.current = window.setTimeout(() => {
        refreshAccessToken().catch((error) => {
          console.error('Automatic token refresh failed:', error)
        })
      }, refreshTime)
    },
    [clearRefreshTimer, refreshAccessToken]
  )

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

          scheduleTokenRefresh(storedAccessToken)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        tokenStorage.clearAll()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [scheduleTokenRefresh])

  useEffect(() => {
    setupInterceptors(() => tokenStorage.getAccessToken(), refreshAccessToken)
  }, [accessToken, refreshAccessToken])

  useEffect(() => {
    return () => {
      clearRefreshTimer()
    }
  }, [clearRefreshTimer])

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

      scheduleTokenRefresh(newAccessToken)
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
