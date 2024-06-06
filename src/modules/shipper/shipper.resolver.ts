import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ShipperDto } from './dtos/shipper.dto';
import { ShipperService } from './services/shipper.service';
import { Shipper } from './entities/shipper.entity';
import { ShipperCreateInput } from './dtos/shiper.create.input';
import { ShipperUpdateInput } from './dtos/shipper.update.input';
import { DeleteResult } from 'typeorm';

@Resolver()
export class ShipperResolver {
  constructor(private readonly shipperService: ShipperService) {}

  @Query((returns) => ShipperDto)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ShipperDto> {
    return await this.shipperService.findOne(id);
  }

  @Query((returns) => [ShipperDto])
  async findAll(): Promise<Shipper[]> {
    return await this.shipperService.findAll();
  }

  @Mutation((returns) => ShipperDto)
  async create(
    @Args('shipperCreateInput') shipperCreateInput: ShipperCreateInput,
  ): Promise<Shipper> {
    return await this.shipperService.create(shipperCreateInput);
  }

  @Mutation((returns) => ShipperDto)
  async update(
    @Args('id', { type: () => ID }) id: string,
    @Args('shipperUpdateInput') shipperUpdateInput: ShipperUpdateInput,
  ) {
    return await this.shipperService.update(id, shipperUpdateInput);
  }

  @Mutation((returns) => ShipperDto, { nullable: true })
  async delete(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return await this.shipperService.delete(id);
  }
}
