import { faker } from '@faker-js/faker';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Shop } from 'src/modules/shop/entities/Shop';

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column({ default: faker.image.url() })
  image: string;

  @Column({ default: false })
  isAlready: boolean;

  @ManyToOne((type) => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne((type) => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
}
