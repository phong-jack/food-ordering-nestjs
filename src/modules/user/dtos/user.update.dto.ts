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
} from 'class-validator';
import { UserRole } from '../constants/user.enum';

export class UserUpdateDto {
  @ApiProperty({ example: faker.person.firstName() })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiProperty({ example: faker.person.lastName() })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  readonly email?: string;

  @ApiProperty({
    example: `+84${faker.string.fromCharacters('1234567890', 9)}`,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(14)
  @ValidateIf((e) => e.mobileNumber !== '')
  readonly phone?: string;

  @ApiProperty({ example: 123456 })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  readonly password?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER, required: false })
  readonly role?: UserRole;

  @IsOptional()
  refreshToken?: string | null;
}
