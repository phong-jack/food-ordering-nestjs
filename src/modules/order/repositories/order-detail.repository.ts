import { BadRequestException } from '@nestjs/common';
import { OrderDetail } from '../entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetailCreateDto } from '../dtos/order-detail.create.dto';

export class OrderDetailRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async findByOrder(orderId: number): Promise<OrderDetail[]> {
    return await this.orderDetailRepository.find({
      relations: { order: true },
      where: { order: { id: orderId } },
    });
  }

  async createOrderDetail(
    orderId: number,
    orderDetailCreateDto: OrderDetailCreateDto,
  ): Promise<OrderDetail> {
    const newOrderDetail = await this.orderDetailRepository.create({
      order: { id: orderId },
      ...orderDetailCreateDto,
      product: { id: orderDetailCreateDto.productId },
    });
    return await this.orderDetailRepository.save(newOrderDetail);
  }
}
