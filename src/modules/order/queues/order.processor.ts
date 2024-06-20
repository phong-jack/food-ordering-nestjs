import {
  InjectQueue,
  OnQueueEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { BadRequestException, HttpException, Logger } from '@nestjs/common';
import { Job, JobsOptions, Queue } from 'bullmq';
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

    const jobOpt: JobsOptions = {
      backoff: { type: 'fixed', delay: 1000 },
      attempts: 60,
      removeOnComplete: true,
      removeOnFail: false,
    };
    job.opts = jobOpt;

    try {
      switch (job.name) {
        case 'order-find-shipper':
          return await this.handleFindShipper(order);
        case 'order-risk-queue':
          return await this.handleRiskQueue(order);
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
    const foundShipper = await this.userService.findOneBy({
      role: UserRole.SHIPPER,
      userMetadata: { key: USER_METADATA_KEY.SHIPPER_STATUS, value: 'ready' },
    });
    console.log('Check shipper:: ', foundShipper);

    if (!foundShipper) {
      throw new BadRequestException('Not found ready shipper :)');
    }

    await this.handleFindShipperSuccess(foundShipper, order);
  }

  async handleFindShipperSuccess(shipper: User, order: Order) {
    const updatedOrder = await this.orderService.update(order.id, {
      shipperId: shipper.id,
    });
    await this.orderService.updateShipperStatus(shipper.id, 'shipping');

    return updatedOrder;
  }

  async handleJobError(job: Job, error: Error): Promise<void> {
    const order = job.data as Order;
    const maxAttempts = 60; // 60s
    const currentAttempts = job.attemptsMade;

    console.log('Current attemps:: ', currentAttempts);

    if (currentAttempts > maxAttempts) {
      await job.remove();
      await this.orderService.changeStatus(order.id, {
        statusCode: ORDER_STATUS.CANCEL,
      });
    }
    await job.moveToFailed(error, '', true);
  }

  async handleRiskQueue(order: Order) {
    const orderEndStatus = [
      ORDER_STATUS.FINISHED,
      ORDER_STATUS.REJECTED,
      ORDER_STATUS.RISK,
    ];

    this.logger.log('Check risk');
    const orderNow = await this.orderService.findById(order.id);
    if (!orderEndStatus.includes(orderNow.orderStatus.statusCode)) {
      await this.orderService.updateRiskStatus(order.id);
    }
  }
}
