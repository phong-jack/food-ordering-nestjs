import { Injectable } from '@nestjs/common';
import { LocateRepository } from '../repositories/locate.repository';
import { Locate } from '../entities/Locate';
import { LocateUpdateDto } from '../dtos/locate.update.dto';
import { LocateCreateDto } from '../dtos/locate.create.dto';
import { retry } from 'rxjs';

@Injectable()
export class LocateService {
  constructor(private locateRepository: LocateRepository) {}

  async findById(id: number): Promise<Locate> {
    return await this.locateRepository.findById(id);
  }

  async createLocate(locateCreateDto: LocateCreateDto): Promise<Locate> {
    return await this.locateRepository.createLocate(locateCreateDto);
  }

  async updateLocate(
    id: number,
    locateUpdateDto: LocateUpdateDto,
  ): Promise<Locate> {
    return await this.locateRepository.updateLocate(id, locateUpdateDto);
  }

  async deleteLocate(id: number): Promise<void> {
    await this.locateRepository.deleteLocate(id);
  }

  async updateLocateByShop(
    shopId: number,
    locateUpdateDto: LocateUpdateDto,
  ): Promise<Locate> {
    return await this.locateRepository.updateLocateByShop(
      shopId,
      locateUpdateDto,
    );
  }
}
