import { ArrayMinSize, ValidateNested } from 'class-validator';
import { OrderDetailCreateDto } from './order-detail.create.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderUpdateDto {
  @ApiProperty({
    type: [OrderDetailCreateDto],
    description: 'Array of order details',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailCreateDto)
  @ArrayMinSize(1)
  orderDetails: OrderDetailCreateDto[];
}
