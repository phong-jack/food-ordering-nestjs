import { Module, forwardRef } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FetchModule } from '../fetch/fetch.module';

@Module({
  imports: [ScheduleModule.forRoot(), FetchModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
