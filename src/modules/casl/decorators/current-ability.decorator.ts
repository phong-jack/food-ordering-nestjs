import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentAbilities = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.abilities;
  },
);
