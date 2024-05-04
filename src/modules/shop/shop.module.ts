import { Module } from '@nestjs/common';
import { ShopService } from './services/shop.service';
import { ShopRepository } from './repositories/shop.repository';
import { Shop } from './entities/Shop';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from './controllers/shop.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([ShopRepository]),
  ],
  providers: [ShopService, ShopRepository],
  controllers: [ShopController],
})
export class ShopModule {}
