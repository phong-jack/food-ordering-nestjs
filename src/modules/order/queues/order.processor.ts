import {
  InjectQueue,
  OnQueueEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { BadRequestException, HttpException, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { QueueName } from 'src/common/constants/queue.constant';
import * as Sentry from '@sentry/node';
import { OrderService } from '../services/order.service';
import { UserService } from 'src/modules/user/services/user/user.service';
import { UserMetadata } from 'src/modules/user/entities/user-metatdata.entity';
import { UserMetadataService } from 'src/modules/user/services/user-metadata.service';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { USER_METADATA_KEY } from 'src/modules/user/constants/user-metadata.constant';
import { Order } from '../entities/order.entity';
import { Shipper } from 'src/modules/shipper/entities/shipper.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { RedisClient } from 'nestjs-redis/dist/redis-client.provider';
import { Redis } from 'ioredis';
import { ORDER_STATUS } from '../constants/order-status.constant';

@Processor(QueueName.ORDER, {
  concurrency: 1,
})
export class OrderProcessor extends WorkerHost {
  private logger = new Logger(OrderProcessor.name);
  private redisClient = new Redis();

  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly userMetadataService: UserMetadataService,
    @InjectQueue(QueueName.ORDER)
    private readonly orderQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    const order = job.data as Order;
    try {
      switch (job.name) {
        case 'order-find-shipper':
          return await this.handleFindShipper(order);
        default:
          throw new Error('No job name match');
      }
    } catch (error) {
      await this.handleJobError(job, error);
      await this.processFailedJob(job, error);
      this.logger.error(error);
    }
  }

  //Như này không phải cách, Code này đã bị lặp lại 2 lần ở shop processor (không biết nên đặt đâu để cả 2 processor đặt được)
  async processFailedJob(job: Job, error: HttpException) {
    if (error instanceof HttpException) {
      Sentry.captureException(error, {
        tags: {
          jobId: job.id,
          jobName: job.name,
        },
        extra: {
          jobId: job.id,
          jobName: job.name,
          jobData: job.data,
          jobPayloadError: error,
        },
      });
    }
  }

  // find shipper
  async handleFindShipper(order: Order) {
    const foundShippers = await this.userService.findAllBy({
      role: UserRole.SHIPPER,
      userMetadata: { key: USER_METADATA_KEY.SHIPPER_STATUS, value: 'ready' },
    });
    console.log('Check shipper:: ', foundShippers);

    if (!foundShippers || foundShippers.length === 0) {
      throw new BadRequestException('Shipper not ready :)');
    }

    await this.handleFindShipperSuccess(foundShippers, order);
  }

  async handleFindShipperSuccess(shippers: User[], order: Order) {
    for (const shipper of shippers) {
      const updatedOrder = await this.orderService.update(order.id, {
        shipperId: shipper.id,
      });

      await this.orderService.updateShipperStatus(shipper.id, 'shipping');

      await this.redisClient.del(this.makeJobKey(order.id));
      return updatedOrder;
    }
  }

  async handleJobError(job: Job, error: Error): Promise<void> {
    const order = job.data as Order;

    const key = this.makeJobKey(order.id);
    const maxAttempts = 60; // 60s
    const delay = 1000; // 1 second

    const attempts = await this.redisClient.incr(key);

    if (attempts <= maxAttempts) {
      await this.orderQueue.add(job.name, job.data, {
        delay: delay,
      });
    } else {
      await this.orderService.changeStatus(order.id, {
        statusCode: ORDER_STATUS.CANCEL,
      });
    }
  }

  private makeJobKey(orderId: number): string {
    return `order:${orderId}:attempts`;
  }
}
