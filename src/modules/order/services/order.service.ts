import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { OrderDetailService } from './order-detail.service';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderDetailService: OrderDetailService,
  ) {}

  async createOrder(orderCreateDto: OrderCreateDto) {
    const order = await this.orderRepository.createOrder(orderCreateDto);
    const orderDetail = await Promise.all(
      orderCreateDto.orderDetails.map((orderDetail) =>
        this.orderDetailService.createOrderDetail(order.id, orderDetail),
      ),
    );
    return {
      ...order,
      orderDetail,
    };
  }

  async findById(id: number) {
    return await this.orderRepository.findById(id);
  }
}
