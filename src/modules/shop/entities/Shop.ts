import { faker } from '@faker-js/faker';
import { Locate } from 'src/modules/geocoding/entities/Locate';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'shop' })
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
}
