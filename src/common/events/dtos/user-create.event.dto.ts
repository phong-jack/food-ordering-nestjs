import { Type } from 'class-transformer';
import { SendMailDto } from 'src/modules/mail/dtos/mail.send-mail.dto';
import { SettingCreateDto } from 'src/modules/setting/dtos/setting.create.dto';

export class UserCreatedEventDto {
  sendMailDto: SendMailDto;
  settingCreateDto: SettingCreateDto;

  constructor(sendMailDto: SendMailDto, settingCreateDto: SettingCreateDto) {
    this.sendMailDto = sendMailDto;
    this.settingCreateDto = settingCreateDto;
  }
}
