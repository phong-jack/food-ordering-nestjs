import { ApiProperty } from '@nestjs/swagger';
import { OrderDetailCreateDto } from './order-detail.create.dto';

export class OrderCreateDto {
  @ApiProperty({ example: 1, description: 'Id of user' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Id of shop' })
  shopId: number;

  @ApiProperty({
    type: [OrderDetailCreateDto],
    description: 'Array of order details',
  })
  orderDetails: OrderDetailCreateDto[];
}
