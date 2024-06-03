import { Module, forwardRef } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';
import { OrderModule } from 'src/modules/order/order.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { ProductModule } from 'src/modules/product/product.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProductModule),
    OrderModule,
    ChatModule,
    ClientsModule.register([
      {
        name: 'PROMOTION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URI],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class GatewayModule {}
