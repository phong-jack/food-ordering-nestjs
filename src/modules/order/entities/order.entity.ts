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
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'shipperId' })
  shipper: User;

  @ManyToOne((type) => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @ManyToOne((type) => OrderStatus)
  @JoinColumn({ name: 'orderStatusCode' })
  orderStatus: OrderStatus;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: Relation<OrderDetail>[];

  @Column({ default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
