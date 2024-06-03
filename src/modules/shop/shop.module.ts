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
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop]),
    CaslModule,
    GeocodingModule,
    UserModule,
    BullModule.registerQueue({
      name: QueueName.SHOP,
    }),
    ClientsModule.register([
      {
        name: 'PROMOTION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URI],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [ShopService, ShopRepository, ShopProcessor],
  controllers: [ShopController],
  exports: [ShopService],
})
export class ShopModule {}
