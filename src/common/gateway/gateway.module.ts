import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';
import { OrderModule } from 'src/modules/order/order.module';
import { ChatModule } from 'src/modules/chat/chat.module';

@Module({
  imports: [AuthModule, OrderModule, ChatModule],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class GatewayModule {}
