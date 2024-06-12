import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { UserMetadataRepository } from './repositories/user-metadata.repository';
import { UserMetadata } from './entities/user-metatdata.entity';
import { UserMetadataService } from './services/user-metadata.service';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserMetadata]), CaslModule],
  providers: [
    UserService,
    UserRepository,
    UserMetadataRepository,
    UserMetadataService,
  ],
  controllers: [UserController],
  exports: [UserService, UserMetadataService],
})
export class UserModule {}
