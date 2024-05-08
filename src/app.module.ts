import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ShopModule } from './modules/shop/shop.module';
import { MailModule } from './modules/mail/mail.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { Product } from './modules/product/entities/product.entity';
import { Category } from './modules/product/entities/category.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { memoryStore } from 'cache-manager';
import { CacheMemoryModule } from './common/cache/cache-memory.module';
import { ChatModule } from './modules/chat/chat.module';
import { EventGateway } from './common/gateway/event.gateway';
import { GatewayModule } from './common/gateway/gateway.module';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.MYSQL_PORT,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
      max: 10,
      store: memoryStore,
    }),
    EventEmitterModule.forRoot({ global: true }),
    UserModule,
    AuthModule,
    ShopModule,
    MailModule,
    OrderModule,
    ProductModule,
    CacheMemoryModule,
    ChatModule,
    GatewayModule,
  ],
})
export class AppModule {}
