import { Injectable } from '@nestjs/common';
import { OrderDetailRepository } from '../repositories/order-detail.repository';
import { OrderDetailCreateDto } from '../dtos/order-detail.create.dto';
import { FindOneOptions } from 'typeorm';
import { OrderDetail } from '../entities/order-detail.entity';

@Injectable()
export class OrderDetailService {
  constructor(private orderDetailRepository: OrderDetailRepository) {}

  async createOrderDetail(
    orderId: number,
    orderDetailCreateDto: OrderDetailCreateDto,
  ) {
    return this.orderDetailRepository.createOrderDetail(
      orderId,
      orderDetailCreateDto,
    );
  }

  async getOrderDetails(orderId: number): Promise<OrderDetail[]> {
    const orderDetails = await this.orderDetailRepository.findByOrder(orderId);
    return orderDetails;
  }

  async findByOrderProduct(filter: { orderId: number; productId: number }) {
    return await this.orderDetailRepository.findOneBy({
      order: { id: filter.orderId },
      product: { id: filter.productId },
    });
  }

  async update(id: number, dto: { quantity?: number; price?: number }) {
    return await this.orderDetailRepository.update(id, dto);
  }
}
