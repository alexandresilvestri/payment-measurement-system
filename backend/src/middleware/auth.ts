import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { JwtPayload } from '../types/auth'
import { UnauthorizedError } from '../errors'
import * as jose from 'jose'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authEnabled = process.env.AUTH_ENABLED !== 'false'

  if (!authEnabled) {
    req.user = {
      userId: 'dev-user-id',
      email: 'dev@localhost',
      userType: 'admin',
      userTypeName: 'admin',
      permissions: {
        approveMeasurement: true,
      },
    }
    return next()
  }

  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.substring(7)
    const decoded = await verifyAccessToken(token)

    req.user = decoded
    next()
  } catch (err) {
    if (err instanceof jose.errors.JWTExpired) {
      next(new UnauthorizedError('Token expired'))
    } else if (
      err instanceof jose.errors.JWTInvalid ||
      err instanceof jose.errors.JWSSignatureVerificationFailed
    ) {
      next(new UnauthorizedError('Invalid token'))
    } else {
      next(err)
    }
  }
}

export const authorizeRole = (allowedUserTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'))
    }

    if (!allowedUserTypes.includes(req.user.userTypeName)) {
      return next(new UnauthorizedError('Insufficient permissions'))
    }

    next()
  }
}
