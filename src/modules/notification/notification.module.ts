import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTokenRepository } from './repositories/notifcation-token.repository';
import { NotificationToken } from './entities/notification-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationToken]),
    TypeOrmModule.forFeature([NotificationTokenRepository]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationTokenRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
