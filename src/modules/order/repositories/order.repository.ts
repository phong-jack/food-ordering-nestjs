import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { BadRequestException } from '@nestjs/common';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { OrderChangeStatusDto } from '../dtos/order.change-status.dto';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';

export class OrderRepository extends BaseRepositoryAbstract<Order> {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findById(id: number): Promise<Order | undefined> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id: id })
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .getOne();

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

  async statisticsOrderByDay(
    shopId: number,
    dateStart: string,
    dateEnd: string,
  ) {
    const startOfDate = new Date(dateStart);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(dateEnd);
    endOfDate.setHours(23, 59, 59, 999);

    const [orders, totalOrders] = await this.orderRepository.findAndCount({
      relations: { shop: true, orderDetails: true },
      where: {
        shop: { id: shopId },
        createdAt: Between(startOfDate, endOfDate),
      },
    });

    return {
      dateStart: startOfDate,
      dateEnd: endOfDate,
      orders: orders,
      totalOrders,
    };
  }
}
