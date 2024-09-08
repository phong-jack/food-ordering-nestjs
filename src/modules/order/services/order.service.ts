import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { OrderDetailService } from './order-detail.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SERVER_EVENTS } from 'src/common/events/constants/events.constant';
import { Order } from '../entities/order.entity';
import { OrderChangeStatusDto } from '../dtos/order.change-status.dto';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { ShopService } from 'src/modules/shop/services/shop.service';
import { OrderStrategyFactoryImpl } from '../strategies/order.strategy.factory.impl';
import { OrderStrategy } from '../strategies/order.strategy.interface';
import { SettingService } from 'src/modules/setting/services/setting.service';
import { OrderUpdateDto } from '../dtos/order.update.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from 'src/common/constants/queue.constant';
import { Queue } from 'bullmq';
import { UserMetadataService } from 'src/modules/user/services/user-metadata.service';
import { USER_METADATA_KEY } from 'src/modules/user/constants/user-metadata.constant';
import { ProductService } from 'src/modules/product/services/product.service';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { Action } from 'src/modules/casl/constants/casl.constant';
import { ForbiddenError, subject } from '@casl/ability';

@Injectable()
export class OrderService {
  private orderStrategy: OrderStrategy;

  constructor(
    private orderRepository: OrderRepository,
    private orderDetailService: OrderDetailService,
    private shopService: ShopService,
    private productService: ProductService,
    private eventEmitter: EventEmitter2,
    private readonly orderStrategyFactory: OrderStrategyFactoryImpl,
    private settingService: SettingService,
    @InjectQueue(QueueName.ORDER)
    private readonly orderQueue: Queue,
    private readonly userMetadataService: UserMetadataService,
  ) {
    this.orderStrategy = this.orderStrategyFactory.create();
  }

  async createOrder(orderCreateDto: OrderCreateDto) {
    for (const detail of orderCreateDto.orderDetails) {
      const product = await this.productService.findById(detail.productId);
      if (!product) {
        throw new BadRequestException(
          'Product not found, Please enter new product',
        );
      }
    }

    const order = await this.orderRepository.createOrder(orderCreateDto);
    const orderDetails = await Promise.all(
      orderCreateDto.orderDetails.map((orderDetail) =>
        this.orderDetailService.createOrderDetail(order.id, orderDetail),
      ),
    );

    const totalAmount = await this.calculatorTotalAmount(order.id);

    const timeHandleRiskOrder = 60 * 60 * 1000; // 1 hour
    this.eventEmitter.emit(SERVER_EVENTS.ORDER_CREATE, order.id);
    this.orderQueue.add('order-find-shipper', order);
    this.orderQueue.add('order-risk-queue', order, {
      delay: timeHandleRiskOrder,
    });

    return await this.findById(order.id);
  }

  async findByShop(shopId: number, page: number, limit: number) {
    return await this.orderRepository.findByShop(shopId, page, limit);
  }

  async findById(id: number): Promise<Order> {
    return await this.orderRepository.findById(id);
  }

  async findOrderByUser(userId: number): Promise<Order[]> {
    return await this.orderRepository.findOrderByUser(userId);
  }

  async findOrderByShop(shopId: number): Promise<Order[]> {
    return await this.orderRepository.findOrderByShop(shopId);
  }

  async update(id: number, orderUpdateDto: OrderUpdateDto) {
    return await this.orderRepository.updateOrder(id, orderUpdateDto);
  }

  async shipperChangeOrderStatus(
    id: number,
    orderChangeStatusDto: OrderChangeStatusDto,
    abilities: AppAbility,
  ) {
    const order = await this.findById(id);
    if (!abilities.can(Action.Update, subject('Order', order))) {
      throw new ForbiddenException(
        'You do not have permission to update this order',
      );
    }

    const statusShipperCanChange = [ORDER_STATUS.FINISHED, ORDER_STATUS.RISK];
    if (!statusShipperCanChange.includes(orderChangeStatusDto.statusCode)) {
      throw new BadRequestException(
        'Your role not have permission to change this status',
      );
    }
    await this.changeStatus(id, orderChangeStatusDto);
    const orderUpdated = await this.findById(id);

    return orderUpdated;
  }

  async userChangeOrderStatus(
    id: number,
    orderChangeStatusDto: OrderChangeStatusDto,
    abilities: AppAbility,
  ) {
    const order = await this.findById(id);
    if (!abilities.can(Action.Update, subject('Order', order))) {
      throw new ForbiddenException(
        'You do not have permission to update this order',
      );
    }

    const statusUserCanChange = [ORDER_STATUS.CANCEL];
    if (!statusUserCanChange.includes(orderChangeStatusDto.statusCode)) {
      throw new BadRequestException(
        'Your role not have permission to change this status',
      );
    }
    await this.changeStatus(id, orderChangeStatusDto);

    return await this.findById(id);
  }

  async shopChangeOrderStatus(
    id: number,
    orderChangeStatusDto: OrderChangeStatusDto,
    abilities: AppAbility,
  ) {
    const order = await this.findById(id);
    if (!abilities?.can(Action.Update, subject('Order', order))) {
      throw new ForbiddenException(
        'You do not have permission to update this order',
      );
    }

    const statusShopCanChange = [
      ORDER_STATUS.ACCEPTED,
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.REJECTED,
    ];
    if (!statusShopCanChange.includes(orderChangeStatusDto.statusCode)) {
      throw new BadRequestException(
        'Your role not have permission to change this status',
      );
    }
    await this.changeStatus(id, orderChangeStatusDto);

    return await this.findById(id);
  }

  async updateRiskStatus(id: number) {
    await this.changeStatus(id, { statusCode: ORDER_STATUS.RISK });
    return this.findById(id);
  }

  async changeStatus(id: number, orderChangeStatusDto: OrderChangeStatusDto) {
    const { statusCode } = orderChangeStatusDto;
    const order = await this.findById(id);

    if (
      [
        ORDER_STATUS.CANCEL,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.FINISHED,
      ].includes(order.orderStatus.statusCode)
    ) {
      throw new BadRequestException('Order status can"t change anymore');
    }

    if (order.orderStatus.statusCode === ORDER_STATUS.INIT) {
      if ([ORDER_STATUS.SHIPPING, ORDER_STATUS.INIT].includes(statusCode)) {
        throw new BadRequestException("Order can't change to this status!");
      }
    }

    if (order.orderStatus.statusCode === ORDER_STATUS.ACCEPTED) {
      if ([ORDER_STATUS.ACCEPTED, ORDER_STATUS.INIT].includes(statusCode)) {
        throw new BadRequestException("Order can't change to this status!");
      }
    }

    if (order.orderStatus.statusCode === ORDER_STATUS.SHIPPING) {
      const statusCanChange = [ORDER_STATUS.FINISHED, ORDER_STATUS.RISK];
      if (!statusCanChange.includes(statusCode)) {
        throw new BadRequestException("Order can't change to this status!");
      }
    }

    const statusFreeShipper = [
      ORDER_STATUS.FINISHED,
      ORDER_STATUS.REJECTED,
      ORDER_STATUS.CANCEL,
      ORDER_STATUS.RISK,
    ];

    if (statusFreeShipper.includes(statusCode) && order.shipper) {
      await this.updateShipperStatus(order.shipper.id, 'ready');
    }

    return this.orderRepository.changeStatus(id, orderChangeStatusDto);
  }

  async updateShipperStatus(shipperId: number, value: string) {
    await this.userMetadataService.updateBy(
      {
        user: { id: shipperId },
        key: USER_METADATA_KEY.SHIPPER_STATUS,
      },
      { value: value },
    );
  }

  async statisticsOrderByDay(
    shopId: number,
    dateStart: string,
    dateEnd: string,
  ) {
    const shop = await this.shopService.findOneById(shopId);
    if (!shop) throw new BadRequestException('Shop not found!');

    const statisticsByDay = await this.orderRepository.statisticsOrderByDay(
      shopId,
      dateStart,
      dateEnd,
    );

    let revenue = 0;
    const statisticPromise = statisticsByDay.orders.map(async (order) => {
      const orderDetails = await this.orderDetailService.getOrderDetails(
        order.id,
      );
      orderDetails.forEach((orderDetail) => {
        console.log('check detail: ', orderDetail);
        console.log('sum: ', orderDetail.quantity * orderDetail.product.price);
        revenue = revenue + orderDetail.quantity * orderDetail.product.price;
      });
    });

    await Promise.all(statisticPromise);

    return {
      dateStart: dateStart,
      dateEnd: dateEnd,
      totalOrders: statisticsByDay.totalOrders,
      revenue: revenue,
    };
  }

  async calculatorTotalAmount(id: number) {
    const order = await this.findById(id);
    const setting = await this.settingService.findAppSettingByKey('appMode');
    let totalAmount = 0;
    for (const orderDetail of order.orderDetails) {
      totalAmount += orderDetail.product.price * orderDetail.quantity;
    }
    totalAmount += this.orderStrategyFactory
      .create(setting?.value)
      .apply(order);

    await this.orderRepository.update(id, { totalAmount: totalAmount });

    return totalAmount;
  }
}
