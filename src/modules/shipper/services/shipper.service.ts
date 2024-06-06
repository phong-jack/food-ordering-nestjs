import { Injectable } from '@nestjs/common';
import { ShipperRepostiory } from '../repositories/shipper.repository';
import { ID } from 'type-graphql';
import { string } from 'yargs';
import { ShipperCreateInput } from '../dtos/shiper.create.input';
import { ShipperUpdateInput } from '../dtos/shipper.update.input';

@Injectable()
export class ShipperService {
  constructor(private readonly shipperRepository: ShipperRepostiory) {}

  findAll() {
    return this.shipperRepository.findAll();
  }

  findOne(id: string) {
    return this.shipperRepository.findOne(id);
  }

  create(shipperCreateInput: ShipperCreateInput) {
    return this.shipperRepository.create(shipperCreateInput);
  }

  update(id: string,shipperUpdateInput: ShipperUpdateInput) {
    return this.shipperRepository.updateV2(id, shipperUpdateInput);
  }

  delete(id: string) {
   return this.shipperRepository.deleteV2(id);
  }
}
