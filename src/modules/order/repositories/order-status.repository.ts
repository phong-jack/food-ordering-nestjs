import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../entities/order-status.entity';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';

export class OrderStatusRepository extends BaseRepositoryAbstract<OrderStatus> {
  constructor(
    @InjectRepository(OrderStatus)
    private orderRepository: Repository<OrderStatus>,
  ) {
    super(orderRepository);
  }

  createOne() {
    console.log('heleo world');
  }
}
