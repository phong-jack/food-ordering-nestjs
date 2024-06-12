import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SETTING_KEY } from '../constants/setting.constant';

export class SettingUpdateDto {
  @ApiProperty({
    example: SETTING_KEY.TIME_ZONE,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: new Date().getTimezoneOffset(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
