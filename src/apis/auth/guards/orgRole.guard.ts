import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ORG_ROLES_KEY, OrgRoleUnion } from '../decorators/orgRole.decorator';

@Injectable()
export class OrgRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredOrgRoles = this.reflector.getAllAndOverride<OrgRoleUnion[]>(
      ORG_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredOrgRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredOrgRoles.includes(user?.orgRole);
  }
}
