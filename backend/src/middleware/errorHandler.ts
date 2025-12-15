import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

/**
 * Centralized error handler middleware
 * Catches all errors thrown in the application and formats the response
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If it's one of our custom application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // If it's an unexpected error (bug)
  console.error('💥 Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}

/**
 * 404 handler for routes that don't exist
 * Should be registered before the error handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.url} not found`,
  });
}
