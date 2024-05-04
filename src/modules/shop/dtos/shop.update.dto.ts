import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ShopUpdateDto {
  @ApiProperty({ example: 'Quán gà nướng', required: true })
  name: string;

  @ApiProperty({ example: '75 Nguyễn Huệ', required: true })
  address: string;

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

  @ApiProperty({ example: faker.image.url() })
  image: string;
}
