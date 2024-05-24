import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../entities/order-status.entity';
import { OrderStatusRepository } from '../repositories/order-status.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class OrderStatusService {
  constructor(private orderStatusRepository: OrderStatusRepository) {}

  async create(dto: DeepPartial<OrderStatus>): Promise<OrderStatus> {
    return await this.orderStatusRepository.create(dto);
  }
}
