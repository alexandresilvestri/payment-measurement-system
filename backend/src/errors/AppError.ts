// Base class for all application errors
export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates this is an expected error, not a bug

    Error.captureStackTrace(this, this.constructor);
  }
}
