import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class GatewayModule {}
