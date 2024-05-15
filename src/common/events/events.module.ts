import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module';
import { OrderListener } from './listeners/order.listener';
import { SettingModule } from 'src/modules/setting/setting.module';
import { UserListener } from './listeners/user.listener';

@Module({
  imports: [GatewayModule, SettingModule],
  providers: [OrderListener, UserListener],
  exports: [OrderListener, UserListener],
})
export class EventsModule {}
