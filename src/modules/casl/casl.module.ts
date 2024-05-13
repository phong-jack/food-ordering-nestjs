import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [ProductModule, OrderModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
