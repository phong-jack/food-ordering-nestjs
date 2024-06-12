import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingService } from 'src/modules/setting/services/setting.service';
import { SendMailDto } from 'src/modules/mail/dtos/mail.send-mail.dto';
import { UserCreatedEventDto } from '../dtos/user-create.event.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { USER_EVENTS } from '../constants/events.user.constant';
import { UserActiveEventDto } from '../dtos/user-active.event.dto';
import { SettingCreateDto } from 'src/modules/setting/dtos/setting.create.dto';
import { UserMetadataService } from 'src/modules/user/services/user-metadata.service';
import { UserMetadataCreateDto } from 'src/modules/user/dtos/user-metadata.create.dto';
import { UserService } from 'src/modules/user/services/user/user.service';
import { UserRole } from 'src/modules/user/constants/user.enum';
import { USER_METADATA_KEY } from 'src/modules/user/constants/user-metadata.constant';

@Injectable()
export class UserListener {
  constructor(
    private settingService: SettingService,
    private mailService: MailService,
    private userMetadataService: UserMetadataService,
    private userService: UserService,
  ) {}

  @OnEvent(USER_EVENTS.REGISTERED)
  async handleUserCreateEvent(userCreatedEventDTo: UserCreatedEventDto) {
    const { settingCreateDto, sendMailDto } = userCreatedEventDTo;

    await this.settingService.createSetting(settingCreateDto);
    await this.mailService.sendRegisterMail(sendMailDto);
  }

  @OnEvent(USER_EVENTS.ACTIVE)
  async handleUserActive(userActiveEventDto: UserActiveEventDto) {
    const userMetadataCreateDto: UserMetadataCreateDto = {
      key: USER_METADATA_KEY.VERIFIED,
      value: userActiveEventDto.typeActive,
      userId: userActiveEventDto.userId,
    };
    await this.userMetadataService.create(userMetadataCreateDto);

    const user = await this.userService.findById(userActiveEventDto.userId);
    if (user.role === UserRole.SHIPPER) {
      const shipperMetadata: UserMetadataCreateDto = {
        key: USER_METADATA_KEY.SHIPPER_STATUS,
        value: 'ready',
        userId: user.id,
      };
      await this.userMetadataService.create(shipperMetadata);
    }
  }
}
