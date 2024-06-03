import { PartialType } from '@nestjs/swagger';
import { Product } from 'src/modules/product/entities/product.entity';

export class PromotionProductDto extends PartialType(Product) {
  quantity: number;
}
