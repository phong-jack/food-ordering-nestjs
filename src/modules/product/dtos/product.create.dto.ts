import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY_ID } from '../constants/category.constant';

export class ProductCreateDto {
  @ApiProperty({
    example: 'Chân gà nướng',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'Giới thiệu món ăn...',
    required: false,
  })
  description: string;

  @ApiProperty({
    example: '20000',
    description: "product 's price",
    required: true,
  })
  price: number;

  @ApiProperty({
    example: faker.image.url(),
    required: false,
  })
  image: string;

  @ApiProperty({
    example: CATEGORY_ID.FOOD,
    required: true,
  })
  categoryId: number;

  @ApiProperty({ example: '1', description: "Shop 's id", required: true })
  shopId: number;
}
