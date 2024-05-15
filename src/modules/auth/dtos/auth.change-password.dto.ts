import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  rePassword: string;
}
