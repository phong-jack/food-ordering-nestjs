import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderCreateDto } from '../dtos/order.create.dto';
import { OrderDetailService } from './order-detail.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SERVER_EVENTS } from 'src/common/events/constants/events.constant';
import { Order } from '../entities/order.entity';
import { OrderChangeStatusDto } from '../dtos/order.change-status.dto';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { ShopService } from 'src/modules/shop/services/shop.service';
import { ProductService } from 'src/modules/product/services/product.service';
import { Between, FindOptionsWhere } from 'typeorm';
import { OrderStatus } from '../entities/order-status.entity';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderUpdateDto } from '../dtos/order.update.dto';
import { OrderDetailCreateDto } from '../dtos/order-detail.create.dto';
import { PromotionProductDto } from '../dtos/promotion.product.dto';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderDetailService: OrderDetailService,
    private shopService: ShopService,
    private productService: ProductService,
    private eventEmitter: EventEmitter2,
    @Inject('PROMOTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createOrder(orderCreateDto: OrderCreateDto) {
    for (const detail of orderCreateDto.orderDetails) {
      const product = await this.productService.findById(detail.productId);
      if (!product) {
        throw new BadRequestException(
          'Product not found, Please enter new product',
        );
      }
    }

    const order = await this.orderRepository.createOrder(orderCreateDto);
    await Promise.all(
      orderCreateDto.orderDetails.map((orderDetail) =>
        this.orderDetailService.createOrderDetail(order.id, orderDetail),
      ),
    );

    this.eventEmitter.emit(SERVER_EVENTS.ORDER_CREATE, order);

    return await this.findById(order.id);
  }

  async findById(id: number): Promise<Order> {
    return await this.orderRepository.findById(id);
  }

  async findOrderByUser(userId: number): Promise<Order[]> {
    return await this.orderRepository.findOrderByUser(userId);
  }

  async findOrderByShop(shopId: number): Promise<Order[]> {
    return await this.orderRepository.findOrderByShop(shopId);
  }

  async findAll(filter: FindOptionsWhere<Order>): Promise<Order[]> {
    return await this.orderRepository.findAll(filter);
  }

  async delete(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async changeStatus(id: number, orderChangeStatusDto: OrderChangeStatusDto) {
    const { statusCode } = orderChangeStatusDto;
    const order = await this.findById(id);

    if (
      [
        ORDER_STATUS.CANCEL,
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.FINISHED,
      ].includes(statusCode)
    ) {
      throw new BadRequestException('Order status can"t change anymore');
    }

    if (order.orderStatus.statusCode === ORDER_STATUS.INIT) {
      if ([ORDER_STATUS.SHIPPING, ORDER_STATUS.INIT].includes(statusCode)) {
        throw new BadRequestException("Order can't change to this status!");
      }
    }

    if (order.orderStatus.statusCode === ORDER_STATUS.ACCEPTED) {
      if ([ORDER_STATUS.ACCEPTED, ORDER_STATUS.INIT].includes(statusCode)) {
        throw new BadRequestException("Order can't change to this status!");
      }
    }

    if (order.orderStatus.statusCode === ORDER_STATUS.SHIPPING) {
      if (statusCode !== ORDER_STATUS.FINISHED) {
        throw new BadRequestException("Order can't change to this status!");
      }
    }

    return this.orderRepository.changeStatus(id, orderChangeStatusDto);
  }

  async statisticsOrderByDay(
    shopId: number,
    dateStart: string,
    dateEnd: string,
  ) {
    const shop = await this.shopService.findOneById(shopId);
    if (!shop) throw new BadRequestException('Shop not found!');

    const statisticsByDay = await this.orderRepository.statisticsOrderByDay(
      shopId,
      dateStart,
      dateEnd,
    );

    let revenue = 0;
    const statisticPromise = statisticsByDay.orders.map(async (order) => {
      const orderDetails = await this.orderDetailService.getOrderDetails(
        order.id,
      );
      orderDetails.forEach((orderDetail) => {
        console.log('check detail: ', orderDetail);
        console.log('sum: ', orderDetail.quantity * orderDetail.product.price);
        revenue = revenue + orderDetail.quantity * orderDetail.product.price;
      });
    });

    await Promise.all(statisticPromise);

    return {
      dateStart: dateStart,
      dateEnd: dateEnd,
      totalOrders: statisticsByDay.totalOrders,
      revenue: revenue,
    };
  }

  //Find ORDERING (CART)
  async findOrderingCart(userId: number, shopId: number) {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    //find cart arround 15 mins
    const foundOrder = await this.orderRepository.findOneBy({
      orderStatus: { statusCode: ORDER_STATUS.ORDERING },
      user: { id: userId },
      shop: { id: shopId },
      updatedAt: Between(fifteenMinutesAgo, now),
    });

    return foundOrder;
  }

  //update
  async updateCart(id: number, detailDto: OrderDetailCreateDto) {
    console.log('Update');
    const cart = await this.findById(id);
    const product = await this.productService.findById(detailDto.productId);
    for (const cartDetail of cart.orderDetails) {
      if (cartDetail.product.id === detailDto.productId) {
        const quantityChangeValue = this.getQuantityChange(
          detailDto.quantity,
          cartDetail.quantity,
        );
        const promotion = await this.getPromotion({
          ...product,
          quantity: quantityChangeValue,
        });

        await this.orderDetailService.update(cartDetail.id, {
          price: detailDto.price,
          quantity: detailDto.quantity,
        });
        break;
      } else {
        console.log('create new detail', cartDetail);

        const promotion = await lastValueFrom(
          this.client.send('add.product', {
            ...product,
            quantity: detailDto.quantity,
          }),
        );
        if (typeof promotion !== 'object') {
          await this.orderDetailService.createOrderDetail(cart.id, {
            ...detailDto,
            price: product.price,
          });
        } else {
          await this.orderDetailService.createOrderDetail(cart.id, {
            ...detailDto,
            price: this.getNewPrice(product.price, promotion.discount),
          });
        }
        break;
      }
    }

    const orderCart = await this.findById(id);
    return orderCart;
  }

  // create item in cart
  async createCart(orderCreateDto: OrderCreateDto) {
    console.log('Create');

    const newCart = await this.orderRepository.createCart(orderCreateDto);
    await Promise.all(
      orderCreateDto.orderDetails.map(async (orderDetail) => {
        const product = await this.productService.findById(
          orderDetail.productId,
        );
        const promotion = await this.getPromotion({
          ...product,
          quantity: orderDetail.quantity,
        });

        if (typeof promotion !== 'object') {
          await this.orderDetailService.createOrderDetail(newCart.id, {
            ...orderDetail,
            price: product.price,
          });
        } else {
          await this.orderDetailService.createOrderDetail(newCart.id, {
            ...orderDetail,
            price: this.getNewPrice(product.price, promotion.discount),
          });
        }
      }),
    );

    const orderCart = await this.findById(newCart.id);
    return orderCart;
  }

  private getNewPrice(productPrice: number, discount: number) {
    return productPrice * (1 - discount);
  }

  private getQuantityChange(newQuantity: number, oldQuantity: number) {
    return newQuantity - oldQuantity;
  }

  private getPromotion(product: PromotionProductDto): Promise<any> {
    return lastValueFrom(this.client.send('add.product', product));
  }
}
