import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ShopModule } from './modules/shop/shop.module';
import { MailModule } from './modules/mail/mail.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { memoryStore } from 'cache-manager';
import { CacheMemoryModule } from './common/cache/cache-memory.module';
import { ChatModule } from './modules/chat/chat.module';
import { GatewayModule } from './common/gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SettingModule } from './modules/setting/setting.module';
import { CaslModule } from './modules/casl/casl.module';
import { GeocodingModule } from './modules/geocoding/geocoding.module';

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
    ShopModule,
    MailModule,
    ProductModule,
    CacheMemoryModule,
    ChatModule,
    GatewayModule,
    SettingModule,
    GeocodingModule,
    OrderModule,
    UserModule,
    AuthModule,
    CaslModule,
  ],
})
export class AppModule {}
