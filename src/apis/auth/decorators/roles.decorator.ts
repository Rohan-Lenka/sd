import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/apis/users/constants/users.role';

export const ROLES_KEY = 'roles';
export type RoleUnion = UserRole;

export const Roles = (...roles: RoleUnion[]) => SetMetadata(ROLES_KEY, roles);
