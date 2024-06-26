import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { EventsModule } from 'src/common/events/events.module';

@Module({
  imports: [UserModule, MailModule, JwtModule.register({}), EventsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
