import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OrderCreateDto } from './order.create.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class OrderUpdateDto extends PartialType(OrderCreateDto) {
  @ApiProperty({
    example: 3,
    description: 'Shipper id',
  })
  @IsNumber()
  @IsOptional()
  shipperId?: number;
}
