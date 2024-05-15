import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { ProductChangeStatusDto } from '../dtos/product.change-status.dto';

export class ProductRepository {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findByShop(shopId: number): Promise<Product[]> {
    return await this.productRepository.find({
      relations: { shop: true },
      where: { shop: { id: shopId } },
    });
  }

  async findById(id: number): Promise<Product | undefined> {
    return await this.productRepository.findOne({
      relations: { shop: true },
      where: { id },
    });
  }

  async createProduct(productCreateDto: ProductCreateDto) {
    const productExist = await this.productRepository.findOne({
      relations: { shop: true, category: true },
      where: {
        name: productCreateDto.name,
        category: { id: productCreateDto.categoryId },
        shop: { id: productCreateDto.shopId },
      },
    });
    if (productExist) throw new BadRequestException('Product already exist!');
    const newProduct = await this.productRepository.create({
      ...productCreateDto,
      category: { id: productCreateDto.categoryId },
      shop: { id: productCreateDto.shopId },
    });
    return await this.productRepository.save(newProduct);
  }

  async updateProduct(
    id: number,
    productUpdateDto: ProductUpdateDto,
  ): Promise<Product> {
    const product = await this.findById(id);
    if (!product) throw new BadRequestException('Product not found!');
    await this.productRepository.save({ id, ...productUpdateDto });
    return await this.findById(id);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.findById(id);
    if (!product) throw new BadRequestException('Product not found');
    await this.productRepository.delete(id);
  }

  async changeStatusProduct(
    id: number,
    productChangeStatusDto: ProductChangeStatusDto,
  ): Promise<Product> {
    const product = await this.findById(id);
    if (!product) throw new BadRequestException('Product not found!');
    product.isAlready = productChangeStatusDto.isAlready;
    return await this.productRepository.save(product);
  }
}
