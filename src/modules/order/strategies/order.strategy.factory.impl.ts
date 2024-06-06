import { Injectable } from '@nestjs/common';
import { OrderStrategyFactory } from './order.strategy.factory';
import { OrderStrategy } from './order.strategy.interface';
import { RainStrategy } from './rain.strategy';
import { NormalStrategy } from './normal.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderStrategyFactoryImpl implements OrderStrategyFactory {
  create(): OrderStrategy {
    const strategy = process.env.ORDER_STRATEGY || 'normal';
    return strategy === 'rain' ? new RainStrategy() : new NormalStrategy();
  }
}
