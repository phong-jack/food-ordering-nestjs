import { BadRequestException, Injectable } from '@nestjs/common';
import { Locate } from '../entities/Locate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocateUpdateDto } from '../dtos/locate.update.dto';
import { LocateCreateDto } from '../dtos/locate.create.dto';

@Injectable()
export class LocateRepository {
  constructor(
    @InjectRepository(Locate) private locateRepository: Repository<Locate>,
  ) {}

  async findALl(): Promise<Locate[]> {
    return await this.locateRepository.find();
  }

  async findById(id: number): Promise<Locate> {
    return await this.locateRepository.findOne({ where: { id } });
  }

  async findByShop(shopId: number): Promise<Locate> {
    return await this.locateRepository.findOne({
      relations: { shop: true },
      where: { shop: { id: shopId } },
    });
  }

  async createLocate(locateCreateDto: LocateCreateDto): Promise<Locate> {
    console.log('Check create: ', locateCreateDto);
    const newLocate = await this.locateRepository.create({
      ...locateCreateDto,
      shop: { id: locateCreateDto.shopId },
    });
    return await this.locateRepository.save(newLocate);
  }

  async updateLocate(id: number, locateUpdateDto: LocateUpdateDto) {
    const locate = await this.findById(id);
    if (!locate) throw new BadRequestException('Locate not found!');
    return await this.locateRepository.save({
      id,
      lat: locateUpdateDto.lat,
      lng: locateUpdateDto.lng,
    });
  }

  async deleteLocate(id: number): Promise<void> {
    const locate = await this.findById(id);
    if (!locate) throw new BadRequestException('Locate not found!');
    await this.locateRepository.delete(id);
  }

  async updateLocateByShop(
    shopId: number,
    locateUpdateDto: LocateUpdateDto,
  ): Promise<Locate> {
    const locate = await this.findByShop(shopId);
    console.log(' CHECK Locate', locate);
    if (!locate) {
      return await this.createLocate({
        shopId: shopId,
        lat: locateUpdateDto.lat,
        lng: locateUpdateDto.lng,
      });
    } else {
      return await this.updateLocate(locate.id, locateUpdateDto);
    }
  }
}
