import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorTypes } from '@common/constants/common.constants';

export class ApiException extends HttpException {
  constructor(
    statusCode: HttpStatus,
    errorType: ErrorTypes,
    message?: string,
    errors?: unknown[],
    cause?: unknown,
  ) {
    super(
      {
        Message: message ?? "Operation Failed!",
        ErrorType: errorType ?? null,
        Errors: errors ?? null,
      },
      statusCode,
      {
        cause,
      },
    );
  }
}