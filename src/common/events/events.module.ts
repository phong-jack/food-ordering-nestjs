import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { OrderListener } from './listeners/order.listener';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserListener } from './listeners/user.listener';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { AuthListener } from './listeners/auth.listener';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [GatewayModule, SettingModule, NotificationModule, UserModule],
  providers: [OrderListener, UserListener, AuthListener],
  exports: [OrderListener, UserListener],
})
export class EventsModule {}
