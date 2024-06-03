import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { OrderStatusService } from 'src/modules/order/services/order-status.service';
import { ProductService } from 'src/modules/product/services/product.service';
import { ShopService } from 'src/modules/shop/services/shop.service';

@Injectable()
export class MigrationOrderStatusSeed {
  constructor(private orderStatusService: OrderStatusService) {}

  @Command({
    command: 'seed:orderStatus',
    describe: 'seed order-status',
  })
  async seed(): Promise<void> {
    const orderStatus1 = this.orderStatusService.create({
      statusCode: 0,
      statusReason: 'INIT',
      description: 'Đơn hàng vừa được khởi tạo',
    });

    const orderStatus2 = this.orderStatusService.create({
      statusCode: 1,
      statusReason: 'ACCEPTED',
      description: 'Đơn hàng đang được xử lý',
    });

    const orderStatus3 = this.orderStatusService.create({
      statusCode: 2,
      statusReason: 'SHIPPING',
      description: 'Đơn hàng đang được vận chuyển',
    });

    const orderStatus4 = this.orderStatusService.create({
      statusCode: 3,
      statusReason: 'FINISHED',
      description: 'Đơn hàng đã hoàn thành',
    });

    const orderStatus5 = this.orderStatusService.create({
      statusCode: 4,
      statusReason: 'CANCEL',
      description: 'Đơn hàng đã bị hủy',
    });

    const orderStatus6 = this.orderStatusService.create({
      statusCode: 5,
      statusReason: 'REJECTED',
      description: 'Đơn hàng đã bị từ chối',
    });

    const orderStatus7 = this.orderStatusService.create({
      statusCode: 10,
      statusReason: 'ORDERING',
      description: 'Đang đặt hàng',
    });

    try {
      await Promise.all([
        orderStatus1,
        orderStatus2,
        orderStatus3,
        orderStatus4,
        orderStatus5,
        orderStatus6,
        orderStatus7,
      ]);
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
