import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY_ID } from '../constants/category.constant';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductCreateDto {
  @ApiProperty({
    example: 'Chân gà nướng',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Giới thiệu món ăn...',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 20000, required: true })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  image?: string;

  @ApiProperty({
    example: CATEGORY_ID.FOOD,
    required: true,
  })
  categoryId: number;

  @ApiProperty({ example: '1', description: "Shop 's id", required: true })
  shopId: number;
}
