import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { Product } from '../entities/product.entity';
import { ProductChangeStatusDto } from '../dtos/product.change-status.dto';
import { FindOneOptions, FindOptions, FindOptionsWhere } from 'typeorm';
import { AppAbility } from 'src/modules/casl/casl-ability.factory';
import { Action } from 'src/modules/casl/constants/casl.constant';
import { subject } from '@casl/ability';

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
    return await this.productRepository.findById(id);
  }

  async createProduct(productCreateDto: ProductCreateDto): Promise<Product> {
    return await this.productRepository.create(productCreateDto);
  }

  async updateProduct(
    id: number,
    productUpdateDto: ProductUpdateDto,
    abilities: AppAbility,
  ): Promise<Product> {
    const product = await this.findById(id);

    if (!abilities?.can(Action.Update, subject('Product', product))) {
      throw new ForbiddenException('Your shop can not update this resource');
    }

    return await this.productRepository.updateProduct(id, productUpdateDto);
  }

  async deleteProduct(id: number, abilities: AppAbility): Promise<void> {
    const product = await this.findById(id);

    if (!abilities?.can(Action.Delete, subject('Product', product))) {
      throw new ForbiddenException('Your shop can not delete this resource');
    }

    await this.productRepository.delete(id);
  }

  async changeStatusProduct(
    id: number,
    productchangeStatusDto: ProductChangeStatusDto,
    abilities: AppAbility,
  ): Promise<Product> {
    const { isAlready } = productchangeStatusDto;
    const product = await this.findById(id);

    if (!abilities?.can(Action.Update, subject('Product', product))) {
      throw new ForbiddenException('Your shop can not update this resource');
    }

    if (product.isAlready === isAlready) {
      throw new BadRequestException('New status no different');
    }

    return await this.productRepository.changeStatusProduct(
      id,
      productchangeStatusDto,
    );
  }
}
