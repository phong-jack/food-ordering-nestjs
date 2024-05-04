import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_META_KEY } from '../constants/auth.constant';

export const Public = () => SetMetadata(IS_PUBLIC_META_KEY, true);
