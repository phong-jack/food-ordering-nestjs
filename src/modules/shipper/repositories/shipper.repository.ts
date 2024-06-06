import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';
import { Shipper } from '../entities/shipper.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ShipperUpdateInput } from '../dtos/shipper.update.input';

export class ShipperRepostiory extends BaseRepositoryAbstract<Shipper> {
  constructor(
    @InjectRepository(Shipper)
    private readonly shipperRepository: Repository<Shipper>,
  ) {
    super(shipperRepository);
  }

  async findOne(id: string): Promise<Shipper> {
    return this.shipperRepository.findOne({ where: { id } });
  }

  async updateV2(
    id: string,
    shipperUpdateInput: ShipperUpdateInput,
  ): Promise<Shipper> {
    await this.shipperRepository.update(id, shipperUpdateInput);
    return this.findOne(id);
  }

  async deleteV2(id: string): Promise<DeleteResult> {
    return await this.shipperRepository.delete(id);
  }
}
