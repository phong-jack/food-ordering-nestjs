import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { EventGateway } from '../../gateway/event.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import { SERVER_EVENTS } from '../constants/events.constant';
import { NotificationSendOrderDto } from 'src/modules/notification/dtos/notifitcation.send-order.dto';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Order } from 'src/modules/order/entities/order.entity';
import { UserService } from 'src/modules/user/services/user/user.service';

@Injectable()
export class OrderListener {
  constructor(
    private readonly gateway: EventGateway,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  @OnEvent(SERVER_EVENTS.ORDER_CREATE)
  async handleCreateOrderEvent(order: Order) {
    const shopAccount = await this.userService.findOneBy({
      shop: { id: order.shop.id },
    });
    const notificationTokens = await this.notificationService.findBy({
      user: { id: shopAccount.id },
    });
    if (!notificationTokens) {
      throw new BadRequestException('Notification tokens not found!');
    }
    const tokens = notificationTokens.map((token) => {
      return token.notificationToken;
    });
    console.log('Check token', notificationTokens);
    const sendDto = this.makeNotificationSendData(order);
    await this.notificationService.sendOrderNotification(tokens, sendDto);
  }

  makeNotificationSendData(order: Order): NotificationSendOrderDto {
    const title = `Bạn có đơn hàng mới từ Phong delivery`;
    const body = `Đơn hàng #${order.id} được xem`;

    return {
      title: title,
      body: body,
      data: { order },
    };
  }
}
