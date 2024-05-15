import { SettingCreateDto } from 'src/modules/setting/dtos/setting.create.dto';

export class UserCreateEventDto {
  settingCreateDto: SettingCreateDto;

  constructor(settingCreateDto: SettingCreateDto) {
    this.settingCreateDto = settingCreateDto;
  }
}
