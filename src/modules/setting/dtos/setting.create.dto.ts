import { ApiProperty } from '@nestjs/swagger';
import { SETTING_KEY } from '../constants/setting.constant';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SettingCreateDto {
  @ApiProperty({
    example: 'appMode',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: 'rain',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  userId?: number;
}
