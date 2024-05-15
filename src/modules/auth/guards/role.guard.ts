import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_META_KEY, ROLES_META_KEY } from '../constants/auth.constant';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_META_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;

    const roles = this.reflector.get<string[]>(
      ROLES_META_KEY,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => userRole === role);
  }
}
