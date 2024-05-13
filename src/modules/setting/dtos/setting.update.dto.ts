import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SETTING_KEY } from '../constants/setting.constant';

export class SettingUpdateDto {
  @IsEnum(SETTING_KEY)
  @IsNotEmpty()
  key: SETTING_KEY;
}
