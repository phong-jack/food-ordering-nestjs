import { Module, forwardRef } from '@nestjs/common';
import { FetchService } from './services/fetch.service';
import { HttpModule } from '@nestjs/axios';
import { ShopModule } from 'src/modules/shop/shop.module';
import { FetchProcessor } from './queues/fetch.processor';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../constants/queue.constant';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => ShopModule),
    BullModule.registerQueue({
      name: QueueName.FETCH,
    }),
  ],
  providers: [FetchService, FetchProcessor],
  exports: [FetchService],
})
export class FetchModule {}
