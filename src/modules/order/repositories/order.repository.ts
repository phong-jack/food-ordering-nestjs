import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { BadRequestException } from '@nestjs/common';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { OrderChangeStatusDto } from '../dtos/order.change-status.dto';

export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      relations: { shop: true, user: true, orderStatus: true },
      where: { id },
    });
    if (!order) throw new BadRequestException('Order not found!');
    return order;
  }

  async createOrder(orderCreateDto: OrderCreateDto) {
    const newOrder = await this.orderRepository.create({
      ...orderCreateDto,
      user: { id: orderCreateDto.userId },
      shop: { id: orderCreateDto.shopId },
      orderStatus: { statusCode: ORDER_STATUS.INIT },
    });
    return await this.orderRepository.save(newOrder);
  }

  async findOrderByUser(userId: number) {
    const orders = await this.orderRepository.find({
      relations: { user: true, shop: true, orderDetails: true },
      where: { user: { id: userId } },
    });

    return orders;
  }

  async findOrderByShop(shopId: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      relations: { user: true, shop: true, orderDetails: true },
      where: { shop: { id: shopId } },
    });

    return orders;
  }

  async changeStatus(id: number, { statusCode }: OrderChangeStatusDto) {
    return await this.orderRepository.save({
      id: id,
      orderStatus: { statusCode: statusCode },
    });
  }
}
