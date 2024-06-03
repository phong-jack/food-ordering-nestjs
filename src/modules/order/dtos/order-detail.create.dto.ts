import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDetailCreateDto {
  @ApiProperty({ example: 1, description: 'Id of product' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 1, description: 'Quantity of product' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  price?: number;
}
