import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SettingService } from 'src/modules/setting/services/setting.service';
import { UserCreateEventDto } from '../dtos/user-create.event.dto';

@Injectable()
export class UserListener {
  constructor(private settingService: SettingService) {}

  @OnEvent('user.create')
  async handleUserCreateEvent(userCreateEventDTo: UserCreateEventDto) {
    const { settingCreateDto } = userCreateEventDTo;
    console.log('chạy ?');
    const newSetting =
      await this.settingService.createSetting(settingCreateDto);
    console.log('check setting:: ', newSetting);
  }
}
