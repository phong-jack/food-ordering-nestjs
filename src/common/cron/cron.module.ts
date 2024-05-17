import { Module, forwardRef } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FetchModule } from '../fetch/fetch.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FetchModule,
    BullModule.registerQueue({ name: 'cron' }),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
