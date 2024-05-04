import { SetMetadata } from '@nestjs/common';
import { ROLES_META_KEY } from '../constants/auth.constant';

export const Roles = (...args: string[]) => SetMetadata(ROLES_META_KEY, args);
