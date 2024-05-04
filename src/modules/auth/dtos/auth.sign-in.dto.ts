import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: faker.internet.userName(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  username: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}
