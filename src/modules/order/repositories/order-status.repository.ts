import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../entities/order-status.entity';

export class OrderStatusRepository {
  constructor(
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
  ) {}

  async findAll(): Promise<OrderStatus[]> {
    return await this.orderStatusRepository.find();
  }
}
