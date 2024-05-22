import { BadRequestException } from '@nestjs/common';
import { OrderDetail } from '../entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetailCreateDto } from '../dtos/order-detail.create.dto';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';

export class OrderDetailRepository extends BaseRepositoryAbstract<OrderDetail> {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {
    super(orderDetailRepository);
  }

  async findByOrder(orderId: number): Promise<OrderDetail[]> {
    return await this.orderDetailRepository
      .createQueryBuilder(OrderDetail.name)
      .select(['OrderDetail.id', 'OrderDetail.quantity', 'OrderDetail.product'])
      .leftJoin('OrderDetail.order', 'order')
      .leftJoinAndSelect('OrderDetail.product', 'product')
      .where('order.id = :orderId', { orderId })
      .getMany();
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
