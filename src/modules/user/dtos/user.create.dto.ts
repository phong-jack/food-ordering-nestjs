import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  isNotEmpty,
  isString,
  minLength,
} from 'class-validator';
import { UserRole } from '../constants/user.enum';

export class UserCreateDto {
  @ApiProperty({ example: faker.person.firstName(), required: true })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ example: faker.person.lastName(), required: true })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    example: faker.internet.email(),
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  readonly email: string;

  @ApiProperty({
    example: `+84${faker.string.fromCharacters('1234567890', 9)}`,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(14)
  @ValidateIf((e) => e.phone !== '')
  readonly phone: string;

  @ApiProperty({
    example: faker.internet.userName(),
    required: true,
  })
  readonly username: string;

  @ApiProperty({ example: 123456, required: true })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  readonly password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  readonly role: UserRole;

  shopId?: number;
}
