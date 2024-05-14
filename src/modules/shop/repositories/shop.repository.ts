import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from '../entities/Shop';
import { Repository } from 'typeorm';
import { ShopCreateDto } from '../dtos/shop.create.dto';
import { ShopUpdateDto } from '../dtos/shop.update.dto';
import { BadRequestException } from '@nestjs/common';

export class ShopRepository {
  constructor(
    @InjectRepository(Shop) private shopRepository: Repository<Shop>,
  ) {}

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.find();
  }

  async findAllWithDistance(): Promise<Shop[]> {
    return await this.shopRepository.find({ relations: { locate: true } });
  }

  async findOneById(id: number): Promise<Shop> {
    return await this.shopRepository.findOne({ where: { id: id } });
  }

  async createShop(shopCreateDto: ShopCreateDto): Promise<Shop> {
    const newShop = await this.shopRepository.create(shopCreateDto);
    return await this.shopRepository.save(newShop);
  }

  async updateShop(id: number, shopUpdateDto: ShopUpdateDto): Promise<Shop> {
    const shop = await this.shopRepository.findBy({ id });
    if (!shop) throw new BadRequestException('Shop not found!');
    await this.shopRepository.save({ id, ...shopUpdateDto });
    return await this.findOneById(id);
  }

  async deleteShop(id: number): Promise<void> {
    const shop = await this.findOneById(id);
    if (!shop) throw new BadRequestException('Shop not found!');
    await this.shopRepository.delete(id);
  }

  async updateShopLocate(id: number, address: string, locateId: number) {
    const user = await this.findOneById(id);
    if (!user) throw new BadRequestException('Shop not found!');
    await this.shopRepository.save({
      id,
      address: address,
      locate: { id: locateId },
    });
    return await this.shopRepository.findOne({
      relations: { locate: true },
      where: { id: id },
    });
  }
}
