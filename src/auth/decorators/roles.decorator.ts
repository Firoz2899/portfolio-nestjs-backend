import { SetMetadata } from '@nestjs/common';

import { type Roles as RoleType } from '@common/constants/common.constants';

export const ROLES_KEY = 'roles';

export const AccessRoles = (...roles: RoleType[]) =>
  SetMetadata(ROLES_KEY, roles);