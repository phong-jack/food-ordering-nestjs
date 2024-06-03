import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FetchService } from 'src/common/fetch/services/fetch.service';
import { ORDER_STATUS } from 'src/modules/order/constants/order-status.constant';
import { OrderService } from 'src/modules/order/services/order.service';
import { LessThan, MoreThan } from 'typeorm';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private fetchService: FetchService,
    private orderService: OrderService,
    @Inject('PROMOTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleFetchShopData() {
    // await this.fetchService.fetchShopData();
    // this.logger.log('Run');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async clearExpiredCarts() {
    this.logger.log('Remove cart expires');
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    const expiresCarts = await this.orderService.findAll({
      orderStatus: { statusCode: ORDER_STATUS.ORDERING },
      updatedAt: LessThan(fifteenMinutesAgo),
    });

    console.log('Check Expires carts:: ', expiresCarts);

    await Promise.all(
      expiresCarts.map(async (cart) => {
        console.log('Check cart: ', cart);
        //emit service để trả lại số lượng khuyến mãi
        for (const cartDetail of cart.orderDetails) {
          this.client.emit('remove.cart', cartDetail.product);
        }

        await this.orderService.delete(cart.id);
      }),
    );
  }
}
