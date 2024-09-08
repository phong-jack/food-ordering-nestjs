import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryCreateDto } from '../dtos/category.create.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async findAll() {
    return await this.categoryRepository.findAll();
  }

  async findByShop(shopId: number) {
    return await this.categoryRepository.findByShop(shopId);
  }

  async create(categoryCreateDto: CategoryCreateDto) {
    return await this.categoryRepository.create(categoryCreateDto);
  }

  async delete(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
