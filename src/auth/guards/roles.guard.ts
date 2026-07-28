import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@auth/decorators/roles.decorator';
import { type Roles as RoleType } from '@common/constants/auth.constants';
import { AuthenticatedRequest } from '@auth/interface/auth-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,    // meta data as saved with this key name
      [
        context.getHandler(), // will check method
        context.getClass(),   // will check controller class
      ],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const hasRole = request.user.Role.some(role => requiredRoles.includes(role));

    return hasRole;
  }
}