import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { OrderListener } from './listeners/order.listener';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserListener } from './listeners/user.listener';
import { MailModule } from 'src/modules/mail/mail.module';
import { UserModule } from 'src/modules/user/user.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { AuthListener } from './listeners/auth.listener';

@Module({
  imports: [
    GatewayModule,
    SettingModule,
    MailModule,
    UserModule,
    NotificationModule,
  ],
  providers: [OrderListener, UserListener, AuthListener],
  exports: [OrderListener, UserListener],
})
export class EventsModule {}
