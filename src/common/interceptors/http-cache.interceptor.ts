import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { CACHE_EACH_USER_CONFIG_META_KEY } from '../cache/constants/cache.constant';

@Injectable()
export class HttpCacheInteceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    if (!isGetRequest) {
      return undefined;
    }

    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    const cacheForEachUser = this.reflector.get(
      CACHE_EACH_USER_CONFIG_META_KEY,
      context.getHandler(),
    );

    if (cacheKey) {
      if (cacheForEachUser) {
        return `${cacheKey}-user:${request?.user?.sub}-query:${request._parseUrl?.path}`;
      } else {
        return `${cacheKey}-query:${request._parseUrl?.path}`;
      }
    }

    if (cacheForEachUser) {
      return `user:${request?.user?.sub}-${super.trackBy(context)}`;
    } else {
      return super.trackBy(context);
    }
  }
}
