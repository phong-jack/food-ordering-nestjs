import { ApiProperty } from '@nestjs/swagger';
import { ORDER_STATUS } from '../constants/order-status.constant';
import { IsEnum } from 'class-validator';

export class OrderChangeStatusDto {
  @ApiProperty({
    enum: ORDER_STATUS,
    default: ORDER_STATUS.ACCEPTED,
  })
  @IsEnum(ORDER_STATUS)
  statusCode: ORDER_STATUS;
}
