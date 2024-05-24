import { Module, forwardRef } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FetchModule } from '../fetch/fetch.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../constants/queue.constant';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FetchModule,
    BullModule.registerQueue({ name: QueueName.CRON }),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
