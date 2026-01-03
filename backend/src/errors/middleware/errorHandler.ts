import { Request, Response } from 'express'
import { AppError } from '../AppError.js'

export function errorHandler(err: Error, req: Request, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  console.error('💥 Unexpected error:', err)
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.url} not found`,
  })
}
