import { ApiProperty } from '@nestjs/swagger';
import { ORDER_STATUS } from '../constants/order-status.constant';

export class OrderChangeStatusDto {
  @ApiProperty({
    enum: ORDER_STATUS,
    default: ORDER_STATUS.ACCEPTED,
  })
  orderStatus: ORDER_STATUS;
}
