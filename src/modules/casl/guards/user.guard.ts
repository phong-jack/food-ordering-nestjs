import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/casl.decorator';
import { PolicyHandler } from '../interfaces/casl.interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserAuthorizeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    const userId = params.id;
    const ability = await this.caslAbilityFactory.createForUser(user, +userId);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
