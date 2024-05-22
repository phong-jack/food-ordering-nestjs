import { Module } from '@nestjs/common';
import { ShopService } from './services/shop.service';
import { ShopRepository } from './repositories/shop.repository';
import { Shop } from './entities/Shop';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from './controllers/shop.controller';
import { CaslModule } from '../casl/casl.module';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { UserModule } from '../user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { ShopProcessor } from './queues/shop.processor';
import { QueueName } from 'src/common/constants/queue.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop]),
    TypeOrmModule.forFeature([ShopRepository]),
    CaslModule,
    GeocodingModule,
    UserModule,
    BullModule.registerQueue({
      name: QueueName.SHOP,
    }),
  ],
  providers: [ShopService, ShopRepository, ShopProcessor],
  controllers: [ShopController],
  exports: [ShopService],
})
export class ShopModule {}
