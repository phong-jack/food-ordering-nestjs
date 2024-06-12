import { Order } from '../entities/order.entity';

export interface OrderStrategy {
  apply(order: Order): number;
}
