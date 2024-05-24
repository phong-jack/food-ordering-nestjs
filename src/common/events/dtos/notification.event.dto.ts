import { PartialType } from '@nestjs/swagger';
import { NotificationCreateDto } from 'src/modules/notification/dtos/notification.create.dto';

export class NotificationEventDto extends PartialType(NotificationCreateDto) {
  userId: number;
  notificationToken: string;

  constructor(userId: number, notificationToken: string) {
    super();
    this.userId = userId;
    this.notificationToken = notificationToken;
  }
}
