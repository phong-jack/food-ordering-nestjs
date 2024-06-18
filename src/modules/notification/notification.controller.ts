import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { NotificationCreateDto } from './dtos/notification.create.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-notification')
  async sendNotidication(@Body() body: { token: string }) {
    const { token } = body;
    return await this.notificationService.sendingNotificationOneUser(token);
  }

  @UseGuards(AccessTokenGuard)
  @Post('send-token')
  async createNotificationToken(
    @Req() req,
    @Body() notificationCreateDto: NotificationCreateDto,
  ) {
    const userId = req.user['sub'];
    return await this.notificationService.createNotificationToken(
      userId,
      notificationCreateDto,
    );
  }
}
