import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { authService } from '../services/instances.js'
import { LoginRequest, RefreshTokenRequest } from '../types/auth.js'

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const loginData: LoginRequest = req.body
    const result = await authService.login(loginData)

    res.status(200).json(result)
  }
)

export const refreshTokenHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshData: RefreshTokenRequest = req.body
    const result = await authService.refreshAccessToken(refreshData)

    res.status(200).json(result)
  }
)

export const logoutHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    await authService.logout(refreshToken)

    res.status(200).json({ message: 'Logged out successfully' })
  }
)
