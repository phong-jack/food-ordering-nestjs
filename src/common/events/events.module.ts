import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { OrderEvents } from './order.events';

@Module({
  imports: [GatewayModule],
  providers: [OrderEvents],
})
export class EventsModule {}
