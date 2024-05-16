import { Module } from '@nestjs/common';
import { GeocodingService } from './service/geocoding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locate } from './entities/Locate';
import { LocateRepository } from './repositories/locate.repository';
import { LocateService } from './service/locate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Locate]),
    TypeOrmModule.forFeature([LocateRepository]),
  ],
  providers: [GeocodingService, LocateRepository, LocateService],
  exports: [GeocodingService, LocateService],
})
export class GeocodingModule {}
