import { CACHE_KEY_METADATA, CacheKey } from '@nestjs/cache-manager';
import { SetMetadata, applyDecorators } from '@nestjs/common';
import { CACHE_EACH_USER_CONFIG_META_KEY } from '../constants/cache.constant';

interface ConfigCache {
  cacheKey: string;
  eachUserConfig: boolean;
}

export function ConfigCache(config: ConfigCache): MethodDecorator {
  return applyDecorators(
    SetMetadata(CACHE_KEY_METADATA, config.cacheKey),
    SetMetadata(CACHE_EACH_USER_CONFIG_META_KEY, config.eachUserConfig),
  );
}
