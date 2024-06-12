import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDetailCreateDto {
  @ApiProperty({ example: 4, description: 'Id of product' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 5, description: 'Quantity of product' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
