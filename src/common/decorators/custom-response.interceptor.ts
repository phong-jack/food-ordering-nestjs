import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ICustomResponse } from '../interfaces/response.interface';
import { CustomResponseInterceptor } from '../interceptors/custom-response.interceptor';
import { API_RESPONSE_META_KEY } from '../constants/api-response.constant';

export function CustomeResponse(
  customResponseConfig: ICustomResponse,
): MethodDecorator {
  return applyDecorators(
    UseInterceptors(CustomResponseInterceptor),
    SetMetadata(API_RESPONSE_META_KEY, customResponseConfig),
  );
}
