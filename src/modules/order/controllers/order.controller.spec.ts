import { OrderRepository } from '../repositories/order.repository';
import { OrderService } from '../services/order.service';
import { OrderController } from './order.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { ShopModule } from '@modules/shop/shop.module';
import { forwardRef } from '@nestjs/common';
import { OrderDetail } from '../entities/order-detail.entity';
import { OrderStatus } from '../entities/order-status.entity';
import { ProductModule } from '@modules/product/product.module';
import { CaslModule } from '@modules/casl/casl.module';
import { UserModule } from '@modules/user/user.module';
import { SettingModule } from '@modules/setting/setting.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from 'src/common/constants/queue.constant';
import { OrderDetailRepository } from '../repositories/order-detail.repository';
import { OrderDetailService } from '../services/order-detail.service';
import { OrderStatusRepository } from '../repositories/order-status.repository';
import { OrderStatusService } from '../services/order-status.service';
import { OrderStrategyFactoryImpl } from '../strategies/order.strategy.factory.impl';
import { UserController } from '@modules/user/controllers/user.controller';
import { UserService } from '@modules/user/services/user/user.service';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CaslModule],
      controllers: [UserController],
      providers: [],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderController = module.get<OrderController>(OrderController);
  });

  // describe('findById', () => {
  //   it('Should return an of Order by id', async () => {
  //     const order = await orderService.findById(5);
  //     expect(await orderController.findById(5)).toEqual(order);
  //   });
  // });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });
});
