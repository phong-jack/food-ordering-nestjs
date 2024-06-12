import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderStrategy } from './order.strategy.interface';

@Injectable()
export class NormalStrategy implements OrderStrategy {
  apply(order: Order): number {
    return 0;
  }
}
