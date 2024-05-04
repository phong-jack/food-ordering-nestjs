import { Shop } from 'src/modules/shop/entities/Shop';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @ManyToOne((type) => OrderStatus)
  @JoinColumn({ name: 'orderStatusCode' })
  orderStatus: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
