import { Module } from '@nestjs/common';
import { OrderModule } from 'src/modules/order/order.module';
import { MigrationProductSeed } from './seed/migration.product.seed';
import { ProductModule } from 'src/modules/product/product.module';
import { CommandModule } from 'nestjs-command';
import { MigrationOrderStatusSeed } from './seed/migration.order-status.seed';
import { ShopModule } from 'src/modules/shop/shop.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MigrationUserSeed } from './seed/migration.user.seed';

@Module({
  imports: [
    CommandModule,
    OrderModule,
    ProductModule,
    ShopModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    MigrationProductSeed,
    MigrationOrderStatusSeed,
    MigrationUserSeed,
  ],
  exports: [],
})
export class MigrationModule {}
