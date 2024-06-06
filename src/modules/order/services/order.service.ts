import {
  BadGatewayException,
  BadRequestException,
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

@Injectable()
export class OrderService {
  private orderStrategy: OrderStrategy;

  constructor(
    private orderRepository: OrderRepository,
    private orderDetailService: OrderDetailService,
    private shopService: ShopService,
    private eventEmitter: EventEmitter2,
    private readonly orderStrategyFactory: OrderStrategyFactoryImpl,
  ) {
    this.orderStrategy = this.orderStrategyFactory.create();
  }

  async createOrder(orderCreateDto: OrderCreateDto) {
    const order = await this.orderRepository.createOrder(orderCreateDto);
    const orderDetails = await Promise.all(
      orderCreateDto.orderDetails.map((orderDetail) =>
        this.orderDetailService.createOrderDetail(order.id, orderDetail),
      ),
    );

    this.eventEmitter.emit(SERVER_EVENTS.ORDER_CREATE, order.id);
    const totalAmount = await this.calculatorTotalAmount(order.id);
    return await this.findById(order.id);
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

  async changeStatus(id: number, orderChangeStatusDto: OrderChangeStatusDto) {
    const { statusCode } = orderChangeStatusDto;
    const order = await this.findById(id);

    if (
      [
        ORDER_STATUS.CANCEL,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.FINISHED,
      ].includes(statusCode)
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
      if (statusCode !== ORDER_STATUS.FINISHED) {
        throw new BadRequestException("Order can't change to this status!");
      }
    }

    return this.orderRepository.changeStatus(id, orderChangeStatusDto);
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
    let totalAmount = 0;
    for (const orderDetail of order.orderDetails) {
      totalAmount += orderDetail.product.price * orderDetail.quantity;
    }
    totalAmount += this.orderStrategy.apply(order);

    await this.orderRepository.update(id, { totalAmount: totalAmount });

    return totalAmount;
  }
}
