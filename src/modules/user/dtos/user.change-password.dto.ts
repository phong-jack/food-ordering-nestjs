import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserUpdateDto } from './user.update.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserChangePasswordDto {
  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  oldPassword: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  newPassword: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  confirmNewPassword: string;
}
