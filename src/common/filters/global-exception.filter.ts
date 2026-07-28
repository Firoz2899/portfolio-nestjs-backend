import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { ApiResponse } from '@common/response/api-response';
import { ErrorTypes } from '@common/constants/common.constants';
import {ApiExceptionResponse} from '@common/interfaces/api-exception-response.interface'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal Server Error';

    let errorType: string | null = ErrorTypes.UNKNOWN_ERROR;

    let errors: unknown[] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const exceptionData = exceptionResponse as ApiExceptionResponse;

        message = exceptionData.Message ?? exception.message;

        errorType = exceptionData.ErrorType ?? ErrorTypes.UNKNOWN_ERROR;

        errors = exceptionData.Errors ?? null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json(
      ApiResponse.failure(
        message,
        errorType as string,
        errors,
      ),
    );
  }
}