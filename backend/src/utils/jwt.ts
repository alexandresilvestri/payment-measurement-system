import * as jose from 'jose'
import { JwtPayload } from '../types/auth'

function getJwtSecret(): Uint8Array {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  return new TextEncoder().encode(process.env.JWT_SECRET)
}

function getJwtRefreshSecret(): Uint8Array {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      'JWT_REFRESH_SECRET is not defined in environment variables'
    )
  }
  return new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)
}

export async function generateAccessToken(
  payload: JwtPayload
): Promise<string> {
  const jwt = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_ACCESS_EXPIRY || '30m')
    .sign(getJwtSecret())

  return jwt
}

export async function generateRefreshToken(payload: {
  userId: string
}): Promise<string> {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_REFRESH_EXPIRY || '90d')
    .sign(getJwtRefreshSecret())

  return jwt
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jose.jwtVerify(token, getJwtSecret())
  return payload as unknown as JwtPayload
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string }> {
  const { payload } = await jose.jwtVerify(token, getJwtRefreshSecret())
  return { userId: payload.userId as string }
}
