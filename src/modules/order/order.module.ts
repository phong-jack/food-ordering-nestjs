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
import { OrderStrategyFactoryImpl } from './strategies/order.strategy.factory.impl';
import { SettingModule } from '../setting/setting.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from 'src/common/constants/queue.constant';
import { UserModule } from '../user/user.module';
import { OrderProcessor } from './queues/order.processor';

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
    forwardRef(() => UserModule),
    SettingModule,
    BullModule.registerQueue({
      name: QueueName.ORDER,
    }),
  ],
  providers: [
    OrderService,
    OrderRepository,
    OrderDetailRepository,
    OrderDetailService,
    OrderStatusRepository,
    OrderStatusService,
    OrderStrategyFactoryImpl,
    OrderProcessor,
  ],
  controllers: [OrderController],
  exports: [OrderService, OrderStatusService, OrderDetailService],
})
export class OrderModule {}
