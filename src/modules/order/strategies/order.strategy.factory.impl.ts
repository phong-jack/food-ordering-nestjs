import { Injectable } from '@nestjs/common';
import { OrderStrategyFactory } from './order.strategy.factory';
import { OrderStrategy } from './order.strategy.interface';
import { RainStrategy } from './rain.strategy';
import { NormalStrategy } from './normal.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderStrategyFactoryImpl implements OrderStrategyFactory {
  create(mode?: string | null): OrderStrategy {
    // const strategy = process.env.ORDER_STRATEGY || 'normal';
    // return strategy === 'rain' ? new RainStrategy() : new NormalStrategy();

    switch (mode) {
      case 'rain':
        return new RainStrategy();
      case 'normal':
        return new NormalStrategy();
      default:
        return new NormalStrategy();
    }
  }
}
