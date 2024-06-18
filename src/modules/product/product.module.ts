import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';
import { CaslModule } from '../casl/casl.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    TypeOrmModule.forFeature([ProductRepository, CategoryRepository]),
    forwardRef(() => CaslModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    CategoryService,
    ProductRepository,
    CategoryRepository,
  ],
  exports: [ProductService],
})
export class ProductModule {}
