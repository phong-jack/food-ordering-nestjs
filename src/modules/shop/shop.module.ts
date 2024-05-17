import { Module } from '@nestjs/common';
import { ShopService } from './services/shop.service';
import { ShopRepository } from './repositories/shop.repository';
import { Shop } from './entities/Shop';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from './controllers/shop.controller';
import { CaslModule } from '../casl/casl.module';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([ShopRepository]),
    CaslModule,
    GeocodingModule,
    UserModule,
  ],
  providers: [ShopService, ShopRepository],
  controllers: [ShopController],
  exports: [ShopService],
})
export class ShopModule {}
