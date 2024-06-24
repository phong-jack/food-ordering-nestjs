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
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';
import { OrderDetail } from './order-detail.entity';
import { Exclude } from 'class-transformer';
import { Shop } from 'src/modules/shop/entities/shop.entity';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Exclude()
  @RelationId((order: Order) => order.user)
  userId: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'shipperId' })
  shipper: User;

  @Exclude()
  @RelationId((order: Order) => order.shipper)
  shipperId: number;

  @ManyToOne((type) => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Relation<Shop>;

  @Exclude()
  @RelationId((order: Order) => order.shop)
  shopId: number;

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
