import { AuthUser } from '../types/auth'

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'conferir_access_token',
  REFRESH_TOKEN: 'conferir_refresh_token',
  USER: 'conferir_user',
} as const

export const tokenStorage = {
  setTokens(accessToken: string, refreshToken: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken)
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user))
  },

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
  },

  getUser(): AuthUser | null {
    const userJson = localStorage.getItem(TOKEN_KEYS.USER)
    if (!userJson) return null
    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  },

  setAccessToken(token: string) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token)
  },

  clearAll() {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.USER)
  },

  hasTokens(): boolean {
    return !!(this.getAccessToken() || this.getRefreshToken())
  },
}
