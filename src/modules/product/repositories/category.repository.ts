import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { BaseRepositoryAbstract } from 'src/common/base/base.abstract.repository';

export class CategoryRepository extends BaseRepositoryAbstract<Category> {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findByShop(shopId: number): Promise<Category[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.product', 'product')
      .leftJoin('product.shop', 'shop')
      .where('shop.id = :shopId', { shopId });

    const categories = await queryBuilder.getMany();
    return categories;
  }
}
