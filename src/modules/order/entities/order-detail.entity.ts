import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Entity('order-detail')
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @OneToOne((type) => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;
}
