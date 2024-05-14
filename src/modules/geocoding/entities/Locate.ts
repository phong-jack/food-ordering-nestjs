import { Shop } from 'src/modules/shop/entities/Shop';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'locate' })
export class Locate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'double' })
  lat: number;

  @Column({ nullable: false, type: 'double' })
  lng: number;

  @OneToOne(() => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Relation<Shop>;
}
