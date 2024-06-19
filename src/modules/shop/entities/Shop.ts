import { faker } from '@faker-js/faker';
import { Exclude } from 'class-transformer';
import { Locate } from 'src/modules/geocoding/entities/Locate';
import { Product } from 'src/modules/product/entities/product.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

@Entity({ name: 'shop' })
@Unique('unique_name', ['name'])
@Unique('unique_shop', ['name', 'address', 'phone'])
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ default: faker.image.url() })
  image: string;

  @Column({ default: false })
  isWorking: boolean;

  @OneToOne(() => Locate)
  @JoinColumn({ name: 'locateId' })
  locate: Relation<Locate>;

  @OneToMany(() => Product, (product) => product.shop) // Define the one-to-many relationship
  products: Relation<Product[]>;
}
