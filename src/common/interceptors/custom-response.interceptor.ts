import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { API_RESPONSE_META_KEY } from '../constants/api-response.constant';
import { ReasonPhrases } from 'http-status-codes';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const customResponseConfig = this.reflector.get(
      API_RESPONSE_META_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        return {
          message: customResponseConfig?.message || ReasonPhrases.OK,
          statusCode: customResponseConfig?.statusCode || HttpStatus.OK,
          data: data,
        };
      }),
    );
  }
}
