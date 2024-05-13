import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { SettingRepository } from './repositories/setting.repository';
import { SettingService } from './services/setting.service';
import { SettingController } from './controllers/setting.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]),
    TypeOrmModule.forFeature([SettingRepository]),
  ],
  providers: [SettingService, SettingRepository],
  exports: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
