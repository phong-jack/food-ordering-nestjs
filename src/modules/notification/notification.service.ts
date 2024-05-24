import { BadRequestException, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { NotificationTokenRepository } from './repositories/notifcation-token.repository';
import { NotificationToken } from './entities/notification-token.entity';
import { NotificationCreateDto } from './dtos/notification.create.dto';
import { User } from '../user/entities/user.entity';
import { DataSource, EntityManager, FindOptionsWhere } from 'typeorm';
import { NotificationSendOrderDto } from './dtos/notifitcation.send-order.dto';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class NotificationService {
  constructor(
    private notificationTokenRepository: NotificationTokenRepository,
    private dataSource: DataSource,
  ) {}

  async findBy(
    filter: FindOptionsWhere<NotificationToken>,
  ): Promise<NotificationToken[]> {
    return await this.notificationTokenRepository.findBy(filter);
  }

  async createNotificationToken(
    userId: number,
    notificationCreateDto: NotificationCreateDto,
  ): Promise<NotificationToken> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      let notification = await manager.findOne(NotificationToken, {
        where: {
          user: { id: userId },
          notificationToken: notificationCreateDto.notificationToken,
        },
      });

      if (notification) {
        return notification;
      } else {
        notification = manager.create(NotificationToken, {
          user: { id: userId },
          notificationToken: notificationCreateDto.notificationToken,
        });
        return await manager.save(notification);
      }
    });
  }

  async sendOrderNotification(tokens: string[], dto: NotificationSendOrderDto) {
    const multicastPayload: MulticastMessage = {
      tokens: tokens,
      notification: {
        title: dto.title,
        body: dto.title,
      },
      data: {
        order: dto.data.toString(),
      },
    };

    return firebase
      .messaging()
      .sendEachForMulticast(multicastPayload)
      .then((response) => {
        return {
          success: true,
          responses: response,
        };
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        return {
          success: false,
          error: error,
        };
      });
  }

  async sendingNotificationOneUser(token: string) {
    const payload = {
      token: token,
      notification: {
        title: 'Phong vip pro ?',
        body: 'Pro ',
      },
      data: {
        name: 'Joe',
        age: '21',
      },
    };
    return firebase
      .messaging()
      .send(payload)
      .then((res) => {
        return {
          success: true,
        };
      })
      .catch((error) => {
        return {
          error: error,
          success: false,
        };
      });
  }
}
