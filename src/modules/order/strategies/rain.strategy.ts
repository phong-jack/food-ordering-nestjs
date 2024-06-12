import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderStrategy } from './order.strategy.interface';

@Injectable()
export class RainStrategy implements OrderStrategy {
  apply(order: Order): number {
    // order fee when rain
    return 5000;
  }
}
