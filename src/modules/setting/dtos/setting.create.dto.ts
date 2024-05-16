import { ApiProperty } from '@nestjs/swagger';
import { SETTING_KEY } from '../constants/setting.constant';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SettingCreateDto {
  @ApiProperty({
    example: SETTING_KEY.TIME_ZONE,
    required: true,
  })
  @IsEnum(SETTING_KEY)
  @IsNotEmpty()
  key: SETTING_KEY;

  @ApiProperty({
    example: new Date().getTimezoneOffset(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    example: 1,
    required: true,
  })
  userId: number;
}
