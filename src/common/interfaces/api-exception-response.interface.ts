import { ErrorTypes } from '@common/constants/common.constants';

export interface ApiExceptionResponse {
  Message: string;
  ErrorType: ErrorTypes | null;
  Errors: unknown[] | null;
}