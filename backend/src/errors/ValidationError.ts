import { AppError } from './AppError';

// Validation Error (HTTP 400)
// Used when input validation fails
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}
