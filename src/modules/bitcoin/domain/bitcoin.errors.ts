import { AppError } from '../../../shared/errors/app-error';

export class InvalidDaysError extends AppError {
  constructor(days: number) {
    super('VALIDATION_ERROR', 'days must be an integer between 1 and 30', { days });
  }
}