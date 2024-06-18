import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CHECK_POLICIES_KEY } from '../decorators/casl.decorator';
import { PolicyHandler } from '../interfaces/casl.interface';
import { AppAbility, CaslAbilityFactory } from '../casl-ability.factory';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class ProductAuthorizeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findById(+request.user['sub']);
    const abilities = await this.caslAbilityFactory.createForProduct(user);
    request.abilities = abilities;

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, abilities),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, abilities: AppAbility) {
    if (typeof handler === 'function') {
      return handler(abilities);
    }
    return handler.handle(abilities);
  }
}
