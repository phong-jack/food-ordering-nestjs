import { OrderStrategy } from './order.strategy.interface';

export interface OrderStrategyFactory {
  create(): OrderStrategy;
}
