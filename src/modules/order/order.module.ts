import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderDetailRepository } from './repositories/order-detail.repository';
import { OrderStatusRepository } from './repositories/order-status.repository';
import { OrderDetailService } from './services/order-detail.service';
import { CaslModule } from '../casl/casl.module';
import { ShopModule } from '../shop/shop.module';
import { OrderStatusService } from './services/order-status.service';
import { ProductModule } from '../product/product.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forFeature([Order, OrderDetail, OrderStatus]),
    TypeOrmModule.forFeature([
      OrderRepository,
      OrderDetailRepository,
      OrderStatusRepository,
    ]),
    forwardRef(() => CaslModule),
    ShopModule,
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
  providers: [
    OrderRepository,
    OrderService,
    OrderDetailRepository,
    OrderDetailService,
    OrderStatusRepository,
    OrderStatusService,
  ],
  controllers: [OrderController],
  exports: [OrderService, OrderStatusService, OrderDetailService],
})
export class OrderModule {}
