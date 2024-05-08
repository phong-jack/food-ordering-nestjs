import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, OrderStatus]),
    TypeOrmModule.forFeature([
      OrderRepository,
      OrderDetailRepository,
      OrderStatusRepository,
    ]),
  ],
  providers: [
    OrderService,
    OrderDetailService,
    OrderRepository,
    OrderDetailRepository,
    OrderStatusRepository,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
