import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingService } from 'src/modules/setting/services/setting.service';
import { UserCreateEventDto } from '../dtos/user-create.event.dto';
import { AuthEvent } from '../constants/auth-event.constant';
import { NotificationService } from 'src/modules/notification/notification.service';
import { NotificationEventDto } from '../dtos/notification.event.dto';

@Injectable()
export class AuthListener {
  constructor(private notificationService: NotificationService) {}

  @OnEvent(AuthEvent.SIGN_IN)
  async handleSignIn(notificationEventDto: NotificationEventDto) {
    // await this.notificationService.createNotificationToken(
    //   notificationEventDto.userId,
    //   notificationEventDto.notificationToken,
    // );
  }
}
