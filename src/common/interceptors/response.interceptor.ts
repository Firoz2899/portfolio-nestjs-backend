import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { map, Observable } from 'rxjs';

import { ApiResponse } from '@common/response/api-response';
import { SUCCESS_MESSAGE_METADATA } from '@common/constants/metadata.constant';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(
    private readonly reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {

    const message =
      this.reflector.get<string>(
        SUCCESS_MESSAGE_METADATA,
        context.getHandler(),
      ) ?? 'Operation Successful';

    return next.handle().pipe(
      map(
        (data: any) =>
          ApiResponse.success(data, message),
      ),
    );
  }
}