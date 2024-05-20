import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { error } from 'console';
import { Observable, catchError, throwError } from 'rxjs';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const request = context.switchToHttp().getRequest();
          Sentry.captureException(error, {
            tags: {
              method: request.method,
              url: request.url,
              params: JSON.stringify(request.params),
              query: JSON.stringify(request.query),
            },
            extra: {
              body: request.body,
              headers: request.headers,
            },
          });
        }
        return throwError(error);
      }),
    );
  }
}

// const errorsToTrackInSentry = [InternalServerErrorException, HttpException];

// const enableSentry = (err: any) => {
//   if (!err) return throwError(() => err);

//   let sendToEntry = errorsToTrackInSentry.some(
//     (errorType) => err instanceof errorType,
//   );

//   if (err?.name?.includes('Error')) {
//     sendToEntry = true;
//   }

//   if (sendToEntry) Sentry.captureException(err);

//   return throwError(() => err);
// };

// @Injectable()
// export class SentryInterceptor implements NestInterceptor {
//   constructor(private env: string) {
//     this.env = env;
//   }
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest();
//     const { user } = request;
//     console.log(' check ? ');
//     if ('development') {
//       Sentry.setUser({ id: user?.id, email: user?.email });
//       Sentry.setTag('request', request.url);
//       Sentry.setTag('request method', request.method);
//       Sentry.setContext('request body', request.body);
//       Sentry.setContext('request params', request.params);
//       Sentry.setContext('request query', request.query);
//       return next.handle().pipe(catchError(enableSentry));
//     }
//     return next.handle();
//   }
// }
