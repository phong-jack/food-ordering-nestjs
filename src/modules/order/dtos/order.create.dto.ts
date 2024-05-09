import { ApiProperty } from '@nestjs/swagger';
import { OrderDetailCreateDto } from './order-detail.create.dto';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderCreateDto {
  @ApiProperty({ example: 1, description: 'Id of user' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1, description: 'Id of shop' })
  @IsNumber()
  @IsNotEmpty()
  shopId: number;

  @ApiProperty({
    type: [OrderDetailCreateDto],
    description: 'Array of order details',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailCreateDto)
  orderDetails: OrderDetailCreateDto[];
}
