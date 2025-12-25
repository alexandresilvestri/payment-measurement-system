export type JwtPayload = {
  userId: string
  email: string
  userType: string
  userTypeName: string
  permissions: {
    approveMeasurement: boolean
  }
}

export type RefreshToken = {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  revokedAt: Date | null
}

export type RefreshTokenDatabaseRow = {
  id: string
  user_id: string
  token: string
  expires_at: Date
  created_at: Date
  revoked_at: Date | null
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: {
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
}

export type RefreshTokenRequest = {
  refreshToken: string
}

export type RefreshTokenResponse = {
  accessToken: string
}
