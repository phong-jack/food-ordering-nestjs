import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ReasonPhrases } from 'http-status-codes';

@Catch()
export class GrapqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toLocaleDateString(),
      error:
        status !== '500'
          ? exception.message.error || exception.message || null
          : 'Internal server error',
    };

    const error = {
      ...errorResponse,
      type: info.parentType,
      field: info.fieldName,
    };

    Logger.error(
      `${info.parentType} ${info.fieldName}`,
      JSON.stringify(error),
      'ExceptionFilter',
    );

    return exception;
  }
}
