import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationCreateDto {
  @IsNotEmpty()
  @IsString()
  notificationToken: string;
}
