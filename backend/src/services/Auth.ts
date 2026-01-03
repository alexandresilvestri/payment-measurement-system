import { randomUUID } from 'crypto'
import { IUserRepository } from '../repository/users.js'
import { IUserTypeRepository } from '../repository/userTypes.js'
import { IRefreshTokenRepository } from '../repository/refreshTokens.js'
import { verifyPassword } from '../utils/passwordHash.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js'
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  JwtPayload,
} from '../types/auth.js'
import { UnauthorizedError } from '../errors/index.js'

export class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private userTypeRepo: IUserTypeRepository,
    private refreshTokenRepo: IRefreshTokenRepository
  ) {}

  async login(params: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepo.findByEmail(
      params.email.toLowerCase().trim()
    )

    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isValidPassword = await verifyPassword(
      user.passwordHash,
      params.password
    )

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const userType = await this.userTypeRepo.findById(user.userType)

    if (!userType) {
      throw new Error('User type not found')
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      userTypeName: userType.name,
      permissions: {
        approveMeasurement: userType.approveMeasurement,
      },
    }

    const accessToken = await generateAccessToken(jwtPayload)
    const refreshTokenValue = await generateRefreshToken({ userId: user.id })

    const refreshTokenExpiry = new Date()
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 90)

    await this.refreshTokenRepo.create({
      id: randomUUID(),
      userId: user.id,
      token: refreshTokenValue,
      expiresAt: refreshTokenExpiry,
      createdAt: new Date(),
      revokedAt: null,
    })

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        userTypeName: userType.name,
        permissions: {
          approveMeasurement: userType.approveMeasurement,
        },
      },
    }
  }

  async refreshAccessToken(
    params: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    let decoded
    try {
      decoded = await verifyRefreshToken(params.refreshToken)
    } catch (err) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const storedToken = await this.refreshTokenRepo.findByToken(
      params.refreshToken
    )

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const user = await this.userRepo.findById(decoded.userId)

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    const userType = await this.userTypeRepo.findById(user.userType)

    if (!userType) {
      throw new Error('User type not found')
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      userTypeName: userType.name,
      permissions: {
        approveMeasurement: userType.approveMeasurement,
      },
    }

    const accessToken = await generateAccessToken(jwtPayload)

    return { accessToken }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepo.revokeToken(refreshToken)
  }
}
