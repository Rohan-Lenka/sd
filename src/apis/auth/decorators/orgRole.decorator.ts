import { SetMetadata } from '@nestjs/common';
import { OrgRole } from 'src/apis/users/constants/user.orgRole';

export const ORG_ROLES_KEY = 'orgRoles';
export type OrgRoleUnion = OrgRole;

export const OrgRoles = (...orgRoles: OrgRoleUnion[]) =>
  SetMetadata(ORG_ROLES_KEY, orgRoles);
