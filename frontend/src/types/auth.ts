export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: string
  userTypeName: string
  permissions: {
    approveMeasurement: boolean
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface AuthContextType {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
}
