import { Injectable } from '@nestjs/common';
import { OrderDetailRepository } from '../repositories/order-detail.repository';
import { OrderDetailCreateDto } from '../dtos/order-detail.create.dto';

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
}
