import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { Product } from '../entities/product.entity';
import { ProductChangeStatusDto } from '../dtos/product.change-status.dto';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async findById(id: number): Promise<Product> {
    return await this.productRepository.findById(id);
  }

  async createProduct(productCreateDto: ProductCreateDto): Promise<Product> {
    return await this.productRepository.createProduct(productCreateDto);
  }

  async updateProduct(
    id: number,
    productUpdateDto: ProductUpdateDto,
  ): Promise<Product> {
    return await this.productRepository.updateProduct(id, productUpdateDto);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.deleteProduct(id);
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
