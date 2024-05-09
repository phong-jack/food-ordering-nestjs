import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { memoryStore } from 'cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  exports: [CacheService],
  providers: [CacheService],
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
          },
        }),
      }),
    }),
  ],
})
export class CacheMemoryModule {}
