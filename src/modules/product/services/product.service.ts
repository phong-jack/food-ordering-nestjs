import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { Product } from '../entities/product.entity';
import { ProductChangeStatusDto } from '../dtos/product.change-status.dto';
import { FindOneOptions, FindOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async findByShop(shopId: number): Promise<Product[]> {
    return await this.productRepository.findByShop(shopId);
  }

  async findById(id: number): Promise<Product> {
    return await this.productRepository.findOneById(id);
  }

  async createProduct(productCreateDto: ProductCreateDto): Promise<Product> {
    return await this.productRepository.create(productCreateDto);
  }

  async updateProduct(
    id: number,
    productUpdateDto: ProductUpdateDto,
  ): Promise<Product> {
    return await this.productRepository.updateProduct(id, productUpdateDto);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async changeStatusProduct(
    id: number,
    productchangeStatusDto: ProductChangeStatusDto,
  ): Promise<Product> {
    return await this.productRepository.changeStatusProduct(
      id,
      productchangeStatusDto,
    );
  }
}
