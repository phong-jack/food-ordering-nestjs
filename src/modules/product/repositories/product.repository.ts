import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOperator, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { ProductChangeStatusDto } from '../dtos/product.change-status.dto';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';

export class ProductRepository extends BaseRepositoryAbstract<Product> {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {
    super(productRepository);
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

  async create(productCreateDto: ProductCreateDto) {
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

  async changeStatusProduct(
    id: number,
    productChangeStatusDto: ProductChangeStatusDto,
  ): Promise<Product> {
    const product = await this.findById(id);
    if (!product) throw new BadRequestException('Product not found!');
    product.isAlready = productChangeStatusDto.isAlready;
    return await this.productRepository.save(product);
  }

  async searchProductsInShop(
    shopId: number,
    keyword: string,
  ): Promise<Product[]> {
    const textQuery = keyword ? keyword : '';
    const regexKeyword = `%${textQuery.toLowerCase()}%`;

    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.shop', 'shop')
      .leftJoinAndSelect('product.category', 'category')
      .where('shop.id = :shopId', { shopId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('product.name LIKE :regexKeyword', { regexKeyword }).orWhere(
            'product.description LIKE :regexKeyword',
            { regexKeyword },
          );
        }),
      )
      .getMany();

    return products;
  }
}
