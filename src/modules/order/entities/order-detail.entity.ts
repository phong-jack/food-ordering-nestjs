import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/modules/product/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_detail')
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @Column()
  quantity: number;
}
