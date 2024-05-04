import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { BadRequestException } from '@nestjs/common';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { OrderDetail } from '../entities/order-detail.entity';
import { OrderDetailRepository } from './order-detail.repository';

export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new BadRequestException('Order not found!');
    return order;
  }

  async createOrder(orderCreateDto: OrderCreateDto) {
    const newOrder = await this.orderRepository.create({
      ...orderCreateDto,
      user: { id: orderCreateDto.userId },
      shop: { id: orderCreateDto.shopId },
      orderStatus: { statusCode: 1 },
    });
    return await this.orderRepository.save(newOrder);
  }
}
