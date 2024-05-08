import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { memoryStore } from 'cache-manager';

@Module({
  exports: [CacheService],
  providers: [CacheService],
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (): Promise<CacheModuleOptions> => {
        return { ttl: 60000, store: memoryStore };
      },
    }),
  ],
})
export class CacheMemoryModule {}
