import { Module, forwardRef } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FetchModule } from '../fetch/fetch.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../constants/queue.constant';
import { OrderModule } from 'src/modules/order/order.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FetchModule,
    OrderModule,
    BullModule.registerQueue({ name: QueueName.CRON }),
    ClientsModule.register([
      {
        name: 'PROMOTION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URI],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
