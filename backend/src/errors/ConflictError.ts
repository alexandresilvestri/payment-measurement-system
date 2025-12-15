import { AppError } from './AppError';

// Conflict Error (HTTP 409)
// Used when there's a conflict with existing data (e.g., duplicate email)
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}
