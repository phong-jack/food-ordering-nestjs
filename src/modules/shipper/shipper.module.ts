import { Module } from '@nestjs/common';
import { ShipperResolver } from './shipper.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipper } from './entities/shipper.entity';
import { ShipperService } from './services/shipper.service';
import { ShipperRepostiory } from './repositories/shipper.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Shipper])],
  providers: [ShipperResolver, ShipperService, ShipperRepostiory],
})
export class ShipperModule {}
