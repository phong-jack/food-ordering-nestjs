import { faker } from '@faker-js/faker';
import { UserCreateDto } from '@modules/user/dtos/user.create.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto extends PickType(UserCreateDto, ['username']) {
  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}
