import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailCreateDto {
  @ApiProperty({ example: 1, description: 'Id of product' })
  productId: number;

  @ApiProperty({ example: 1, description: 'Quantity of product' })
  quantity: number;
}
