import { AppError } from './AppError';

// Not Found Error (HTTP 404)
//  Used when a requested resource doesn't exist
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
