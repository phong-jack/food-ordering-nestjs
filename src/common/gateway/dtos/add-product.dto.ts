import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { OrderDetailCreateDto } from 'src/modules/order/dtos/order-detail.create.dto';

export class AddProductDto extends OrderDetailCreateDto {}
