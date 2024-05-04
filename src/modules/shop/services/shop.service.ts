import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../repositories/shop.repository';
import { Shop } from '../entities/Shop';
import { ShopUpdateDto } from '../dtos/shop.update.dto';
import { ShopCreateDto } from '../dtos/shop.create.dto';

@Injectable()
export class ShopService {
  constructor(private shopRepository: ShopRepository) {}

  async findAll(): Promise<Shop[]> {
    return await this.shopRepository.findAll();
  }

  async findOneById(id: number): Promise<Shop> {
    return await this.shopRepository.findOneById(id);
  }

  async updateShop(id: number, shopUpdateDto: ShopUpdateDto) {
    return await this.shopRepository.updateShop(id, shopUpdateDto);
  }

  async createShop(shopCreateDto: ShopCreateDto) {
    return await this.shopRepository.createShop(shopCreateDto);
  }

  async deleteShop(id: number) {
    await this.shopRepository.deleteShop(id);
  }
}
