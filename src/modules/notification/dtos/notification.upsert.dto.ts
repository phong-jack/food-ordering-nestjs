import { PartialType } from '@nestjs/swagger';
import { NotificationCreateDto } from './notification.create.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NotificationUpsertDto extends PartialType(NotificationCreateDto) {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  notificationToken?: string;
}
