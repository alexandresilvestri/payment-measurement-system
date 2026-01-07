interface JWTPayload {
  exp?: number
  iat?: number
  [key: string]: unknown
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

export const getTokenExpirationTime = (token: string): number | null => {
  const payload = decodeJWT(token)
  return payload?.exp ? payload.exp * 1000 : null
}

export const isTokenExpired = (token: string): boolean => {
  const expirationTime = getTokenExpirationTime(token)
  if (!expirationTime) return true
  return Date.now() >= expirationTime
}

export const getTimeUntilExpiration = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token)
  if (!expirationTime) return 0
  return Math.max(0, expirationTime - Date.now())
}
