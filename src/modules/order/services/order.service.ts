import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { OrderDetailService } from './order-detail.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SERVER_EVENTS } from 'src/common/events/constants/events.constant';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderDetailService: OrderDetailService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createOrder(orderCreateDto: OrderCreateDto) {
    const order = await this.orderRepository.createOrder(orderCreateDto);
    const orderDetail = await Promise.all(
      orderCreateDto.orderDetails.map((orderDetail) =>
        this.orderDetailService.createOrderDetail(order.id, orderDetail),
      ),
    );
    this.eventEmitter.emit(SERVER_EVENTS.ORDER_CREATE, order.id, order);
    return {
      ...order,
      orderDetail,
    };
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
}
